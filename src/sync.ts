import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

import { config } from "./config";
import { anonymiseCustomer } from "./domain/anonymiseCustomer";
import type { Customer } from "./domain/Customer";

const fullReindexFlag = "--full-reindex";
const isFullReindexMode = process.argv.includes(fullReindexFlag);

type CustomerWithId = Customer & { _id: ObjectId };

const withDb =
  (
    asyncFn: (
      originalCollection: Collection,
      anonymousCollection: Collection
    ) => Promise<void>
  ) =>
  async () => {
    const mongoClient = new MongoClient(config.db.uri);
    try {
      await mongoClient.connect();
      console.log("Connected successfully to server");
      const db = mongoClient.db(config.db.name);
      const originalCollection = db.collection(
        config.db.customersCollection.original
      );
      const anonymousCollection = db.collection(
        config.db.customersCollection.anonymous
      );

      await asyncFn(originalCollection, anonymousCollection);
    } finally {
      await mongoClient.close();
    }
  };

const fullReindex = withDb(async (originalCollection, anonymousCollection) => {
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
});

// TODO The application can be restarted. In the event of a restart, it should continue where it left off, not missing any changes that happened while the application was offline.
const watch = withDb(async (originalCollection, anonymousCollection) => {
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
});

if (isFullReindexMode) {
  void fullReindex();
} else {
  void watch();
}
