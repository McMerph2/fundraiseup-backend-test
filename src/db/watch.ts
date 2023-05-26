import type { Collection, UpdateResult } from "mongodb";
import { ObjectId } from "mongodb";

import { withCustomersCollections } from "../db/withCustomersCollections";
import { anonymiseCustomer } from "../domain/anonymiseCustomer";
import type { CustomerWithId } from "./CustomerWithId";

const logCustomer = (
  id: string,
  acknowledged: boolean,
  success: string,
  fail: string
) => {
  if (acknowledged) {
    console.log(`Successfully ${success} customer#${id}`);
  } else {
    console.error(`Failed to ${fail} customer#${id} customer(s)`);
  }
};

const handleUnaccounted = async (
  originalCollection: Collection,
  anonymousCollection: Collection
) => {
  const lastAnonymousCustomer = await anonymousCollection
    .find()
    .sort({ _id: -1 })
    .limit(1)
    .next();
  if (!lastAnonymousCustomer) return;

  console.log("Start handling unaccounted clients");
  const unaccounted = originalCollection
    .find({
      _id: {
        $lte: ObjectId.createFromTime(Math.floor(Date.now() / 1000)),
        $gt: lastAnonymousCustomer._id,
      },
    })
    .sort({ _id: 1 });
  for await (const customer of unaccounted) {
    const result = await anonymousCollection.insertOne(
      anonymiseCustomer(customer as CustomerWithId)
    );
    logCustomer(
      result.insertedId.toHexString(),
      result.acknowledged,
      "inserted unaccounted",
      "insert unaccounted"
    );
  }

  console.log("Finish handling unaccounted clients");
};

// TODO Add batching
export const watch = withCustomersCollections(
  async (originalCollection, anonymousCollection) => {
    void handleUnaccounted(originalCollection, anonymousCollection);

    const changeStream = originalCollection.watch([], {
      fullDocument: "updateLookup",
    });
    for await (const change of changeStream) {
      if (change.operationType === "insert") {
        const customer = change.fullDocument;
        const result = await anonymousCollection.insertOne(
          anonymiseCustomer(customer as CustomerWithId)
        );
        logCustomer(
          result.insertedId.toHexString(),
          result.acknowledged,
          "inserted new",
          "insert new"
        );
      } else if (change.operationType === "update") {
        const customer = change.fullDocument;
        if (!customer) throw new Error("Failed to get client");
        if (!(customer["_id"] instanceof ObjectId))
          throw new Error("No customer ID");

        const result = (await anonymousCollection.replaceOne(
          { _id: customer["_id"] },
          anonymiseCustomer(customer as CustomerWithId)
        )) as UpdateResult;
        logCustomer(
          customer["_id"].toHexString(),
          result.acknowledged,
          "updated",
          "update"
        );
      }
    }
  }
);
