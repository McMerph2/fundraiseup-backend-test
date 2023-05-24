import { randomInt } from "node:crypto";
import { setTimeout } from "node:timers/promises";

import type { Collection } from "mongodb";

import { config } from "../config";
import { createRandomCustomer } from "../domain/createRandomCustomer";

export const insertCustomers = async (collection: Collection) => {
  const customersNumber = randomInt(
    config.creation.customers.min,
    config.creation.customers.max + 1
  );
  const customerList = Array.from(
    { length: customersNumber },
    createRandomCustomer
  );
  const result = await collection.insertMany(customerList);
  if (result.acknowledged) {
    console.log(`Successfully inserted ${result.insertedCount} customer(s)`);
  } else {
    console.error(`Failed to insert ${customerList.length} customer(s)`);
  }

  await setTimeout(config.creation.intervalInMs);
  setImmediate(async () => {
    await insertCustomers(collection);
  });
};
