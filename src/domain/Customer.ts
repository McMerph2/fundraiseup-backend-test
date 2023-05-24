import type { createRandomCustomer } from "./createRandomCustomer";

export type Customer = ReturnType<typeof createRandomCustomer>;
