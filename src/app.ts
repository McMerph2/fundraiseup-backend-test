import { MongoClient } from "mongodb";

import { config } from "./config";
import { insertCustomers } from "./db/insertCustomers";

async function main() {
  const mongoClient = new MongoClient(config.db.uri);
  await mongoClient.connect();
  console.log("Connected successfully to server");
  const db = mongoClient.db(config.db.name);
  const collection = db.collection(config.db.customersCollection.original);
  void insertCustomers(collection);
}

void main();
