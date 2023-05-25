import { ObjectId } from "mongodb";

import { withCustomersCollections } from "../db/withCustomersCollections";
import { anonymiseCustomer } from "../domain/anonymiseCustomer";
import { type CustomerWithId } from "./CustomerWithId";

// TODO Add batching
// TODO The application can be restarted. In the event of a restart, it should continue where it left off, not missing any changes that happened while the application was offline.
export const watch = withCustomersCollections(
  async (originalCollection, anonymousCollection) => {
    const changeStream = originalCollection.watch([], {
      fullDocument: "updateLookup",
    });

    for await (const change of changeStream) {
      if (change.operationType === "insert") {
        const customer = change.fullDocument;
        const result = await anonymousCollection.insertOne(
          anonymiseCustomer(customer as CustomerWithId)
        );
        const id = result.insertedId.toHexString();
        if (result.acknowledged) {
          console.log(`Successfully inserted customer#${id}`);
        } else {
          console.error(`Failed to insert customer#${id} customer(s)`);
        }
      } else if (change.operationType === "update") {
        const customer = change.fullDocument;
        if (!customer) throw new Error("Failed to get client");
        if (!(customer["_id"] instanceof ObjectId))
          throw new Error("No customer ID");

        const result = await anonymousCollection.replaceOne(
          { _id: customer["_id"] },
          anonymiseCustomer(customer as CustomerWithId)
        );
        const id = customer["_id"].toHexString();
        if (result.acknowledged) {
          console.log(`Successfully updated customer#${id}`);
        } else {
          console.error(`Failed to update customer#${id} customer(s)`);
        }
      }
    }
  }
);
