import type { Collection } from "mongodb";
import { ObjectId } from "mongodb";

import { withCustomersCollections } from "../db/withCustomersCollections";
import { anonymiseCustomer } from "../domain/anonymiseCustomer";
import type { CustomerWithId } from "./CustomerWithId";
import { addTask } from "./tasksQueue";

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

  console.info("Start handling unaccounted clients");
  const unaccounted = originalCollection
    .find({
      _id: {
        $lte: ObjectId.createFromTime(Math.floor(Date.now() / 1000)),
        $gt: lastAnonymousCustomer._id,
      },
    })
    .sort({ _id: 1 });
  for await (const customer of unaccounted) {
    addTask(
      {
        type: "insert unaccounted",
        customer: anonymiseCustomer(customer as CustomerWithId),
      },
      anonymousCollection
    );
  }

  console.info("Finish handling unaccounted clients");
};

export const watch = withCustomersCollections(
  async (originalCollection, anonymousCollection) => {
    void handleUnaccounted(originalCollection, anonymousCollection);

    const changeStream = originalCollection.watch([], {
      fullDocument: "updateLookup",
    });
    for await (const change of changeStream) {
      if (change.operationType === "insert") {
        addTask(
          {
            type: "insert",
            customer: anonymiseCustomer(change.fullDocument as CustomerWithId),
          },
          anonymousCollection
        );
      } else if (change.operationType === "update") {
        const customer = change.fullDocument;
        if (!customer) throw new Error("Failed to get client");
        if (!(customer["_id"] instanceof ObjectId))
          throw new Error("No customer ID");

        addTask(
          {
            type: "update",
            customer: anonymiseCustomer(customer as CustomerWithId),
          },
          anonymousCollection
        );
      }
    }
  }
);
