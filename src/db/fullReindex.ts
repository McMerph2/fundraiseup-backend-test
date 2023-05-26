import type { ObjectId } from "mongodb";
import { MongoServerError } from "mongodb";

import { anonymiseCustomer } from "../domain/anonymiseCustomer";
import type { Customer } from "../domain/Customer";
import { withCustomersCollections } from "./withCustomersCollections";

type CustomerWithId = Customer & { _id: ObjectId };

export const fullReindex = withCustomersCollections(
  async (originalCollection, anonymousCollection) => {
    for await (const customer of originalCollection.find()) {
      try {
        const result = await anonymousCollection.insertOne(
          anonymiseCustomer(customer as CustomerWithId)
        );
        const id = result.insertedId.toHexString();
        if (result.acknowledged) {
          console.debug(`Successfully inserted customer#${id}`);
        } else {
          console.error(`Failed to insert customer#${id} customer(s)`);
        }
      } catch (error) {
        const isDuplicateKey =
          error instanceof MongoServerError && error.code === 11000;
        if (!isDuplicateKey) throw error;
      }
    }
  }
);
