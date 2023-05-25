import { MongoClient } from "mongodb";

import { config } from "./config";
import { anonymiseCustomer } from "./domain/anonymiseCustomer";
import type { Customer } from "./domain/Customer";

const fullReindexFlag = "--full-reindex";
const isFullReindexMode = process.argv.includes(fullReindexFlag);

async function fullReindex() {
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

    for await (const customer of originalCollection.find()) {
      const result = await anonymousCollection.insertOne(
        anonymiseCustomer(customer as Customer & { _id: typeof customer._id })
      );
      const id = result.insertedId.toHexString();
      if (result.acknowledged) {
        console.log(`Successfully inserted customer#${id}`);
      } else {
        console.error(`Failed to insert customer#${id} customer(s)`);
      }
    }
  } finally {
    await mongoClient.close();
  }
}

if (isFullReindexMode) {
  void fullReindex();
} else {
  console.log("TODO Implement watch mode");
}
