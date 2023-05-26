import type { Collection, UpdateResult } from "mongodb";

import { config } from "../config";
import type { CustomerWithId } from "./CustomerWithId";

type Task = {
  type: "insert" | "insert unaccounted" | "update";
  customer: CustomerWithId;
};
let queue: Task[] = [];

const logCustomer = (
  id: string,
  acknowledged: boolean,
  success: string,
  fail: string
) => {
  if (acknowledged) {
    console.debug(`Successfully ${success} customer#${id}`);
  } else {
    console.error(`Failed to ${fail} customer#${id} customer(s)`);
  }
};

const handleTasks = async (
  taskList: Task[],
  anonymousCollection: Collection
) => {
  for await (const task of taskList) {
    if (task.type === "insert" || task.type === "insert unaccounted") {
      const result = await anonymousCollection.insertOne(task.customer);
      logCustomer(
        result.insertedId.toHexString(),
        result.acknowledged,
        task.type === "insert" ? "inserted new" : "inserted unaccounted",
        task.type === "insert" ? "insert new" : "insert unaccounted"
      );
    } else {
      const result = (await anonymousCollection.replaceOne(
        { _id: task.customer._id },
        task.customer
      )) as UpdateResult;
      logCustomer(
        task.customer._id.toHexString(),
        result.acknowledged,
        "updated",
        "update"
      );
    }
  }
};

const flushTasks = (anonymousCollection: Collection) => {
  void handleTasks([...queue], anonymousCollection);
  queue = [];
};

export const addTask = (task: Task, anonymousCollection: Collection) => {
  const timer = setTimeout(() => {
    flushTasks(anonymousCollection);
  }, config.watch.flushIntervalInMs);

  queue.push(task);
  if (queue.length >= config.watch.batchSize) {
    clearTimeout(timer);
    flushTasks(anonymousCollection);
  }
};
