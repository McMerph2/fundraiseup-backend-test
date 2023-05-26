import { isPositiveInt } from "./utils/isPositiveInt";

const getMissingStringError = (envVar: string) =>
  new Error(`Please provide "${envVar}" env var`);

const getNonPositiveIntError = (envVar: string) =>
  new Error(`Missing or invalid (not a positive integer) ${envVar} env var`);

if (!process.env["DB_URI"]) throw getMissingStringError("DB_URI");
if (!process.env["DB_NAME"]) throw getMissingStringError("DB_NAME");
if (!process.env["DB_CUSTOMERS_COLLECTION_NAME"])
  throw getMissingStringError("DB_CUSTOMERS_COLLECTION_NAME");
if (!process.env["DB_CUSTOMERS_ANONYMOUS_COLLECTION_NAME"])
  throw getMissingStringError("DB_CUSTOMERS_ANONYMOUS_COLLECTION_NAME");

if (!isPositiveInt(process.env["CREATION_INTERVAL_IN_MS"]))
  throw getNonPositiveIntError("CREATION_INTERVAL_IN_MS");
if (!isPositiveInt(process.env["CREATION_CUSTOMERS_MIN_NUMBER"]))
  throw getNonPositiveIntError("CREATION_CUSTOMERS_MIN_NUMBER");
if (!isPositiveInt(process.env["CREATION_CUSTOMERS_MAX_NUMBER"]))
  throw getNonPositiveIntError("CREATION_CUSTOMERS_MAX_NUMBER");
if (!isPositiveInt(process.env["WATCH_BATCH_SIZE"]))
  throw getNonPositiveIntError("WATCH_BATCH_SIZE");

export const config = {
  db: {
    uri: process.env["DB_URI"],
    name: process.env["DB_NAME"],
    customersCollection: {
      original: process.env["DB_CUSTOMERS_COLLECTION_NAME"],
      anonymous: process.env["DB_CUSTOMERS_ANONYMOUS_COLLECTION_NAME"],
    },
  },
  creation: {
    intervalInMs: Number(process.env["CREATION_INTERVAL_IN_MS"]),
    customers: {
      min: Number(process.env["CREATION_CUSTOMERS_MIN_NUMBER"]),
      max: Number(process.env["CREATION_CUSTOMERS_MAX_NUMBER"]),
    },
  },
  watch: {
    batchSize: Number(process.env["WATCH_BATCH_SIZE"]),
  },
};
