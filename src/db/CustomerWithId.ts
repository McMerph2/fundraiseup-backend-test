import { type ObjectId } from "mongodb";

import type { Customer } from "../domain/Customer";

export type CustomerWithId = Customer & { _id: ObjectId };
