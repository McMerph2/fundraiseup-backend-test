import type { Collection } from "mongodb";
import { MongoClient } from "mongodb";

import { config } from "../config";

export const withDb =
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
