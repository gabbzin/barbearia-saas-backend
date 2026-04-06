# Guia de Requisicoes com Prisma Client (Tenant-Aware)

Este documento explica como fazer requisicoes no backend usando o `PrismaService` com contexto de tenant.

## Visao Geral

O projeto possui dois modos de acesso ao banco:

1. Acesso global (system level): `this.prisma`
2. Acesso escopado por tenant (tenant level): `this.prisma.tenant`

A diferenca entre eles e obrigatoria para evitar vazamento de dados entre tenants.

## Onde isso e definido

As regras estao em:

- `src/modules/database/prisma.service.ts`

O getter `tenant` cria um client estendido com filtros automaticos por `tenantId` para modelos especificos.

## Quando usar cada client

### 1) `this.prisma` (global)

Use para fluxos sem escopo de tenant, por exemplo:

- autenticacao
- webhooks
- cron jobs
- operacoes administrativas globais
- tabelas globais (ex.: `User`, `Barbershop`, `Session`, `Account`, `Verification`)

### 2) `this.prisma.tenant` (escopado)

Use em regras de negocio do tenant (rotas da aplicacao).

Se nao existir tenant no contexto, uma `BadRequestException` e lancada:

- "Operacao requer contexto de Tenant, mas nenhum foi encontrado."

## Como o tenantId e injetado automaticamente

No client `this.prisma.tenant`, os modelos abaixo recebem escopo por tenant:

- `Barber`
- `BarberService`
- `Booking`
- `Subscription`
- `Plan`
- `UserTenant`

### Operacoes de leitura

Operacoes:

- `findFirst`
- `findMany`
- `findUnique`
- `count`
- `aggregate`

Comportamento:

- adiciona `tenantId` em `where`

### Operacoes de criacao

Operacoes:

- `create`
- `createMany`

Comportamento:

- injeta `tenantId` em `data`
- em `createMany`, injeta em cada item do array

### Operacoes de escrita/remocao

Operacoes:

- `update`
- `updateMany`
- `upsert`
- `delete`
- `deleteMany`

Comportamento:

- adiciona `tenantId` em `where`

## Exemplos de uso correto

### Listar servicos do tenant logado

```ts
return this.prisma.tenant.barberService.findMany({
  where: { barberId },
  orderBy: { name: "asc" },
});
```

Resultado efetivo (conceitual):

- `where` vira `{ barberId, tenantId: <tenant-do-contexto> }`

### Criar agendamento no tenant atual

```ts
return this.prisma.tenant.booking.create({
  data: {
    barberId,
    serviceId,
    userId,
    date,
    priceInCents,
  },
});
```

Resultado efetivo (conceitual):

- `data` recebe `tenantId` automaticamente

### Atualizar recurso sem risco de cruzar tenant

```ts
return this.prisma.tenant.barber.update({
  where: { id: barberId },
  data: { phone: newPhone },
});
```

Resultado efetivo (conceitual):

- `where` vira `{ id: barberId, tenantId: <tenant-do-contexto> }`

## Exemplos de uso incorreto

### Errado: usar client global em rota de negocio tenant

```ts
// Evite em regras tenant
return this.prisma.booking.findMany({ where: { barberId } });
```

Risco:

- nao aplica filtro automatico de tenant
- pode retornar dados fora do tenant corrente

### Errado: confiar em tenantId enviado pelo frontend

```ts
// Nao dependa do tenantId vindo da requisicao
return this.prisma.tenant.booking.create({
  data: {
    tenantId: dto.tenantId,
    barberId: dto.barberId,
    serviceId: dto.serviceId,
    userId: dto.userId,
    date: dto.date,
    priceInCents: dto.priceInCents,
  },
});
```

Motivo:

- o backend ja define `tenantId` pelo contexto da requisicao
- o tenantId de entrada deve ser desnecessario para operacoes tenant-aware

## Atencoes importantes

1. `findUnique` com `tenantId`

O extension adiciona `tenantId` tambem em `findUnique`. Se o modelo nao tiver chave unica composta compativel, essa consulta pode falhar por validacao do Prisma.

Boa pratica:

- quando nao houver unique composta com `tenantId`, prefira `findFirst` com `where`.

2. Operacoes fora da lista de modelos tenant

Modelos fora da lista `tenantModels` nao recebem filtro automatico no `this.prisma.tenant`.

Boa pratica:

- confirme se o modelo e realmente multi-tenant antes de usar `this.prisma.tenant`
- se for multi-tenant e nao estiver na lista, adicione-o no `tenantModels`

3. Middleware de tenant

Para `this.prisma.tenant` funcionar, o tenant deve estar populado no `tenantStorage` durante a requisicao.

Sem isso, a operacao falha com `BadRequestException`.

## Checklist rapido para novas features

- Em rota tenant: usar `this.prisma.tenant`
- Nao confiar em `tenantId` vindo do cliente
- Validar se o modelo esta em `tenantModels`
- Em busca unica, revisar se `findUnique` e compativel com `tenantId`
- Cobrir com teste de isolamento entre tenants

## Resumo

- `this.prisma` = contexto global
- `this.prisma.tenant` = contexto de tenant com filtros automaticos
- O isolamento depende do contexto de tenant estar corretamente preenchido por requisicao
