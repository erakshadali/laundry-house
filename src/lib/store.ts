import * as file from "./store-file";
import type { NewOrderInput } from "./store-types";

/**
 * Data access used by the whole app. Postgres when DATABASE_URL is set (production),
 * a local JSON file otherwise (development). The Postgres module is only loaded when needed.
 */
const usePg = !!process.env.DATABASE_URL;
type Impl = typeof file;
let cached: Impl | null = null;
async function impl(): Promise<Impl> {
  if (cached) return cached;
  cached = usePg ? ((await import("./store-pg")) as unknown as Impl) : file;
  return cached;
}

export type { NewOrderInput };
export const listServices = async (activeOnly = false) => (await impl()).listServices(activeOnly);
export const updateService = async (...a: Parameters<Impl["updateService"]>) => (await impl()).updateService(...a);
export const listOrders = async () => (await impl()).listOrders();
export const findOrder = async (...a: Parameters<Impl["findOrder"]>) => (await impl()).findOrder(...a);
export const updateOrderStatus = async (...a: Parameters<Impl["updateOrderStatus"]>) => (await impl()).updateOrderStatus(...a);
export const slotAvailability = async (date: string) => (await impl()).slotAvailability(date);
export const createOrder = async (input: NewOrderInput) => (await impl()).createOrder(input);
