import { setTimeout } from "node:timers/promises";

import type { Collection } from "mongodb";

import { config } from "../config";
import { createRandomCustomer } from "../domain/createRandomCustomer";
import { getRandomInt } from "../utils/getRandomInt";

export const insertCustomers = async (collection: Collection) => {
  const customersNumber = getRandomInt(
    config.creation.customers.min,
    config.creation.customers.max
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
