import type { ObjectId } from "mongodb";

import { anonymiseCustomer } from "../domain/anonymiseCustomer";
import type { Customer } from "../domain/Customer";
import { withCustomersCollections } from "./withCustomersCollections";

type CustomerWithId = Customer & { _id: ObjectId };

export const fullReindex = withCustomersCollections(
  async (originalCollection, anonymousCollection) => {
    for await (const customer of originalCollection.find()) {
      const result = await anonymousCollection.insertOne(
        anonymiseCustomer(customer as CustomerWithId)
      );
      const id = result.insertedId.toHexString();
      if (result.acknowledged) {
        console.log(`Successfully inserted customer#${id}`);
      } else {
        console.error(`Failed to insert customer#${id} customer(s)`);
      }
    }
  }
);