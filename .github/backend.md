# Documentação de Rotas de Backend

Este documento descreve todas as rotas de backend disponíveis no sistema de Barbearia SaaS, incluindo rotas de API REST e Server Actions. Cada seção detalha o propósito, parâmetros, responsabilidades e retornos esperados de cada endpoint ou action. Iremos fazer todas funcionarem no método tradicional de API REST

## Índice

1. [Rotas da API REST](#rotas-da-api-rest)
2. [Server Actions - Autenticação](#server-actions---autenticação)
3. [Server Actions - Barbeiros](#server-actions---barbeiros)
4. [Server Actions - Serviços](#server-actions---serviços)
5. [Server Actions - Agendamentos](#server-actions---agendamentos)
6. [Server Actions - Assinaturas](#server-actions---assinaturas)
7. [Server Actions - Dashboard](#server-actions---dashboard)

---

## Rotas da API REST

### 1. Autenticação - `/api/auth/[...all]`

**Arquivo:** `app/api/auth/[...all]/route.ts`

**Métodos:** `GET`, `POST`

**Descrição:**
Rota catch-all para autenticação usando BetterAuth. Gerencia todas as operações de autenticação incluindo login, registro, logout e gerenciamento de sessões.

**Responsabilidades:**
- Login de usuários
- Registro de novos usuários
- Logout
- Gerenciamento de sessões
- Recuperação de senha

---

### 2. Webhook Stripe - `/api/stripe/webhook`

**Arquivo:** `app/api/stripe/webhook/route.ts`

**Método:** `POST`

**Descrição:**
Recebe e processa eventos de webhook do Stripe. Valida a assinatura do webhook e delega o processamento para handlers específicos baseados no tipo de evento.

**Eventos Processados:**

#### 2.1. `checkout.session.completed`
**Handler:** `handleCheckoutCompleted.ts`

**Descrição:**
Processa a finalização bem-sucedida de um checkout de agendamento. Cria um novo registro de agendamento (booking) no banco de dados com os dados do pagamento.

**Responsabilidades:**
- Validar se o evento já foi processado
- Extrair metadados do checkout (serviceId, barberId, userId, date)
- Obter informações do payment intent e charge ID
- Criar registro de agendamento no banco de dados
- Revalidar o cache da página de agendamentos

#### 2.2. `charge.refunded`
**Handler:** `handleRefund.ts`

**Descrição:**
Processa reembolsos de pagamentos. Atualiza o status do agendamento para cancelado quando um reembolso é realizado.

**Responsabilidades:**
- Identificar o agendamento pelo charge ID
- Atualizar status para CANCELLED
- Registrar data de cancelamento
- Revalidar cache de agendamentos

#### 2.3. `customer.subscription.updated`
**Handler:** `handleSubscriptionUpdated.ts`

**Descrição:**
Processa atualizações em assinaturas de clientes. Atualiza o status e informações da assinatura no banco de dados.

**Responsabilidades:**
- Extrair userId dos metadados da assinatura
- Mapear status do Stripe para status interno (ACTIVE, CANCELLED, INCOMPLETE)
- Atualizar dados da assinatura no banco de dados
- Registrar informação de cancelamento no fim do período

#### 2.4. `invoice.paid`
**Handler:** `handleInvoicePaid.ts`

**Descrição:**
Processa o pagamento de faturas de assinaturas. Atualiza a assinatura com informações de período e status ativo.

**Responsabilidades:**
- Obter ID da assinatura da fatura
- Buscar metadados da assinatura (userId, planId)
- Extrair período de vigência (periodStart, periodEnd)
- Atualizar assinatura no banco de dados com status ACTIVE

#### 2.5. `customer.subscription.deleted`
**Handler:** `handleSubscriptionDeleted.ts`

**Descrição:**
Processa o cancelamento definitivo de assinaturas. Atualiza o status da assinatura para cancelado.

**Responsabilidades:**
- Atualizar status da assinatura para CANCELLED
- Desmarcar flag de cancelamento no fim do período

---

## Server Actions - Autenticação

Todas as Server Actions relacionadas à autenticação são gerenciadas pelo BetterAuth através da rota `/api/auth/[...all]`.

---

## Server Actions - Barbeiros

### 1. `createBarber`

**Arquivo:** `features/barber/actions/create-barber.ts`

**Descrição:**
Cria um novo barbeiro no sistema. Registra o usuário com role de BARBER e cria o perfil de barbeiro com disponibilidade padrão.

**Parâmetros:**
- `name` (string): Nome do barbeiro (mínimo 2 caracteres)
- `email` (string): Email válido
- `password` (string): Senha (mínimo 8 caracteres)

**Responsabilidades:**
- Criar usuário via BetterAuth com role BARBER
- Criar perfil de barbeiro no banco de dados
- Configurar disponibilidade padrão (Segunda a Sexta, 09:00 - 18:00)
- Revalidar cache da página de painel
- Retornar ID do barbeiro criado

**Retorno:**
```typescript
{ success: true, barberId: string }
```

---

### 2. `getSettingsByBarberId`

**Arquivo:** `features/barber/actions/barber-actions.ts`

**Descrição:**
Busca as configurações de disponibilidade de um barbeiro específico.

**Parâmetros:**
- `barberId` (string): ID do barbeiro

**Responsabilidades:**
- Buscar registros de disponibilidade do barbeiro
- Reconstruir objeto com dias da semana e horários
- Retornar null se não houver disponibilidade configurada

**Retorno:**
```typescript
{
  barberId: string,
  daysOfWeek: number[],
  startTime: string,
  endTime: string
} | null
```

---

### 3. `createDisponibility`

**Arquivo:** `features/barber/actions/barber-actions.ts`

**Descrição:**
Cria ou atualiza a disponibilidade de horários de um barbeiro.

**Parâmetros:**
- `data` (TimesSchemaData): Dados de disponibilidade incluindo dias da semana e horários
- `barberId` (string): ID do barbeiro

**Responsabilidades:**
- Processar dias selecionados (0-6, domingo a sábado)
- Usar transação para garantir atomicidade
- Remover disponibilidades anteriores do barbeiro
- Criar novos registros de disponibilidade para cada dia selecionado
- Retornar configuração atualizada

**Retorno:**
```typescript
{
  daysOfWeek: number[],
  startTime: string,
  endTime: string,
  barberId: string
}
```

---

## Server Actions - Serviços

### 1. `getServicesByBarberId`

**Arquivo:** `features/service/actions/service-actions.ts`

**Descrição:**
Busca todos os serviços oferecidos por um barbeiro específico.

**Parâmetros:**
- `barberId` (string): ID do barbeiro

**Responsabilidades:**
- Buscar serviços do barbeiro no banco de dados
- Retornar lista de serviços

**Retorno:**
```typescript
BarberService[]
```

---

### 2. `createService`

**Arquivo:** `features/service/actions/service-actions.ts`

**Descrição:**
Cria um novo serviço para um barbeiro.

**Parâmetros:**
- `data` (FormData): Dados do formulário contendo:
  - `name`: Nome do serviço
  - `description`: Descrição do serviço
  - `price`: Preço em reais
- `barberId` (string): ID do barbeiro

**Responsabilidades:**
- Extrair dados do FormData
- Converter preço de reais para centavos
- Criar registro de serviço no banco de dados
- Usar imagem padrão (temporário, até implementar upload)

**Retorno:**
```typescript
BarberService
```

---

### 3. `patchService`

**Arquivo:** `features/service/actions/service-actions.ts`

**Descrição:**
Atualiza um serviço existente.

**Parâmetros:**
- `data` (FormData): Dados atualizados do serviço
- `serviceId` (string): ID do serviço a ser atualizado

**Responsabilidades:**
- Extrair dados do FormData
- Converter preço de reais para centavos
- Atualizar registro no banco de dados

**Retorno:**
```typescript
BarberService
```

---

### 4. `deleteService`

**Arquivo:** `features/service/actions/service-actions.ts`

**Descrição:**
Remove um serviço do sistema.

**Parâmetros:**
- `serviceId` (string): ID do serviço a ser removido

**Responsabilidades:**
- Deletar registro do serviço do banco de dados
- Retornar ID do serviço deletado

**Retorno:**
```typescript
{ serviceId: string }
```

---

## Server Actions - Agendamentos

### 1. `createBookingCheckoutSession`

**Arquivo:** `features/booking/functions/create-booking-checkout-session.ts`

**Descrição:**
Cria uma sessão de checkout no Stripe para pagamento de um agendamento.

**Parâmetros:**
- `serviceId` (string UUID): ID do serviço a ser agendado
- `date` (Date): Data e hora do agendamento

**Responsabilidades:**
- Verificar autenticação do usuário
- Buscar informações do serviço e barbeiro
- Criar sessão de checkout no Stripe com:
  - Dados do serviço
  - Informações do barbeiro
  - Metadados do agendamento (serviceId, barberId, userId, date)
  - URLs de sucesso e cancelamento
- Retornar URL de checkout

**Retorno:**
```typescript
{ url: string | null }
```

---

### 2. `cancelBooking`

**Arquivo:** `features/booking/functions/cancel-booking.ts`

**Descrição:**
Cancela um agendamento existente.

**Parâmetros:**
- `bookingId` (string UUID): ID do agendamento a ser cancelado

**Responsabilidades:**
- Verificar autenticação do usuário
- Verificar se o agendamento existe
- Validar que o usuário é o dono do agendamento
- Atualizar status para CANCELLED
- Registrar data de cancelamento

**Retorno:**
```typescript
{ success: true }
```

---

### 3. `confirmBooking`

**Arquivo:** `features/booking/functions/confirm-booking.ts`

**Descrição:**
Marca um agendamento como concluído. Usado pelo barbeiro após realizar o serviço.

**Parâmetros:**
- `bookingId` (string): ID do agendamento

**Responsabilidades:**
- Atualizar status do agendamento para COMPLETED

**Retorno:**
```typescript
Booking
```

---

### 4. `getBookingsUserIdAction`

**Arquivo:** `features/booking/actions/get-bookings-user-action.ts`

**Descrição:**
Busca todos os agendamentos de um usuário específico.

**Parâmetros:**
- `userId` (string): ID do usuário

**Responsabilidades:**
- Verificar autenticação do usuário
- Buscar agendamentos do usuário
- Revalidar cache da página de agendamentos

**Retorno:**
```typescript
{ success: true }
```

---

## Server Actions - Assinaturas

### 1. `createSignature`

**Arquivo:** `features/signature/actions/create-signature.ts`

**Descrição:**
Cria uma nova assinatura (plano de pagamento recorrente) para um usuário.

**Parâmetros:**
- `planId` (string): ID do plano de assinatura

**Responsabilidades:**
- Verificar configuração do Stripe
- Verificar autenticação do usuário
- Validar se usuário não tem assinatura ativa
- Buscar informações do plano
- Criar sessão de checkout do Stripe com:
  - Modo de assinatura
  - Metadados (userId, planId)
  - URLs de sucesso e cancelamento
- Retornar URL de checkout

**Retorno:**
```typescript
{ url: string }
```

**Erros possíveis:**
- Usuário não autenticado
- Assinatura ativa já existe
- Plano não encontrado
- Erro na criação da sessão de checkout

---

### 2. `cancelSignature`

**Arquivo:** `features/signature/actions/cancel-signature.ts`

**Descrição:**
Cancela uma assinatura existente no fim do período atual.

**Parâmetros:**
- `signatureId` (string UUID): ID da assinatura

**Responsabilidades:**
- Verificar autenticação do usuário
- Buscar assinatura no banco de dados
- Validar que a assinatura possui stripeSubscriptionId
- Validar que o usuário é o dono da assinatura
- Atualizar assinatura no Stripe para cancelar no fim do período
- Flag `cancel_at_period_end` é definida como true

**Retorno:**
```typescript
{ success: true }
```

**Erros possíveis:**
- Usuário não autenticado
- Assinatura não encontrada
- Usuário não autorizado
- Assinatura sem ID do Stripe

---

### 3. `getCurrentSubscriptionAction`

**Arquivo:** `features/signature/actions/get-current-subscription.ts`

**Descrição:**
Busca a assinatura atual do usuário autenticado.

**Responsabilidades:**
- Delegar para função de repositório `getCurrentSubscription`
- Retornar dados da assinatura ativa

**Retorno:**
```typescript
Subscription | null
```

---

## Server Actions - Dashboard

### 1. `getBarberDashboardInfos`

**Arquivo:** `app/(protected)/barber/dashboard/actions/getInfos.ts`

**Descrição:**
Busca informações do dashboard para o barbeiro, incluindo estatísticas do dia.

**Parâmetros:**
- `barberId` (string): ID do barbeiro

**Responsabilidades:**
- Buscar próximo agendamento do dia
- Calcular faturamento do dia (soma de agendamentos completados)
- Contar atendimentos realizados hoje
- Contar agendamentos futuros do dia
- Processar resultados em paralelo para otimização

**Retorno:**
```typescript
{
  nextBooking: Booking & { service, user } | null,
  billing: {
    _sum: { priceInCents: number },
    _count: { id: number }
  },
  todayBilling: string, // Formatado em BRL
  totalSchedules: number,
  servicesPerformed: number
}
```

---

### 2. `getAdminDashboardInfos`

**Arquivo:** `app/(protected)/admin/painel/actions/getInfos.ts`

**Descrição:**
Busca informações do dashboard administrativo com estatísticas gerais e comparações mensais.

**Responsabilidades:**
- Verificar autenticação e role ADMIN
- Calcular faturamento do mês atual
- Calcular faturamento do mês anterior
- Contar total de barbeiros cadastrados
- Calcular diferença percentual de faturamento entre meses
- Calcular diferença na quantidade de agendamentos
- Processar múltiplas queries em paralelo

**Retorno:**
```typescript
{
  monthlyEarnings: {
    _sum: { priceInCents: number },
    _count: { id: number }
  },
  barbersCount: number,
  monthlyEarningsPercentageChange: number,
  monthlyEarningsDifferenceCount: number,
  monthlyEarningsDifference: number
}
```

**Erros possíveis:**
- Usuário não autenticado
- Usuário sem permissão de ADMIN

---

## Observações Técnicas

### Segurança
- Todas as Server Actions usam `"use server"` directive
- Validação de autenticação usando BetterAuth
- Validação de schemas usando Zod
- Uso de `next-safe-action` para actions com validação estruturada
- Verificação de autorização antes de operações sensíveis
- Validação de webhook signature do Stripe

### Padrões Utilizados
- **actionClient**: Cliente customizado para Server Actions com validação
- **Prisma**: ORM para todas as operações de banco de dados
- **Stripe**: Processamento de pagamentos e assinaturas
- **BetterAuth**: Sistema de autenticação
- **next-safe-action**: Biblioteca para Server Actions type-safe

### Cache e Revalidação
- Uso de `revalidatePath` após operações que modificam dados
- Principais paths revalidados:
  - `/bookings`: Após criar/cancelar agendamentos
  - `/painel`: Após criar barbeiro

### Transações
- Uso de `prisma.$transaction` para operações atômicas
- Exemplo: Atualização de disponibilidade de barbeiros (delete + create)

### Tipos de Status

#### Booking Status
- `SCHEDULED`: Agendamento confirmado
- `COMPLETED`: Serviço realizado
- `CANCELLED`: Agendamento cancelado

#### Subscription Status
- `ACTIVE`: Assinatura ativa
- `CANCELLED`: Assinatura cancelada
- `INCOMPLETE`: Assinatura incompleta (pagamento pendente)

### Integração Stripe
- Webhooks configurados para processar eventos automaticamente
- Checkout sessions para pagamentos únicos (agendamentos)
- Checkout sessions para assinaturas recorrentes (planos)
- Metadados personalizados para rastreabilidade

---

## Arquitetura

O backend segue uma arquitetura modular organizada por features:

```
features/
├── barber/
│   ├── actions/        # Server Actions de barbeiros
│   └── services/       # Repositórios e serviços
├── booking/
│   ├── actions/        # Server Actions de agendamentos
│   └── functions/      # Funções de negócio
├── service/
│   └── actions/        # Server Actions de serviços
├── signature/
│   └── actions/        # Server Actions de assinaturas
└── user/
    └── repository/     # Repositório de usuários
```

### Camadas

1. **API Routes** (`app/api/`): Endpoints REST tradicionais (webhooks, auth)
2. **Server Actions** (`features/*/actions/`): Funções server-side com validação
3. **Functions** (`features/*/functions/`): Lógica de negócio reutilizável
4. **Repositories** (`features/*/repository/`): Acesso a dados e queries
5. **Services** (`features/*/services/`): Serviços auxiliares

---

## Conclusão

Este documento apresenta todas as rotas de backend do sistema de Barbearia SaaS, incluindo:

- **2 rotas de API REST**: Autenticação e Webhooks Stripe
- **5 handlers de webhook**: Processar eventos do Stripe
- **3 actions de barbeiros**: Criar e gerenciar barbeiros
- **4 actions de serviços**: CRUD de serviços
- **4 actions de agendamentos**: Criar, cancelar, confirmar e listar
- **3 actions de assinaturas**: Criar, cancelar e buscar assinaturas
- **2 actions de dashboard**: Estatísticas para barbeiro e admin

Total: **23 endpoints/actions documentados**
