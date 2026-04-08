import { AsyncLocalStorage } from "async_hooks";

interface ITenantStorage {
	tenantId: string;
}

export const tenantStorage = new AsyncLocalStorage<ITenantStorage>();
