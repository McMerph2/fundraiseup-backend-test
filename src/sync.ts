import { fullReindex } from "./db/fullReindex";
import { watch } from "./db/watch";

const fullReindexFlag = "--full-reindex";
const isFullReindexMode = process.argv.includes(fullReindexFlag);

if (isFullReindexMode) {
  void fullReindex();
} else {
  void watch();
}
