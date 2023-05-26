# [Fundraise Up backend test](https://fundraiseup.notion.site/Backend-test-0e0e0961077e4e74bb6afc42dcf1759a)

## Build

- [install pnpm](https://pnpm.io/installation)
- install dependencies via `pnpm i`

## Config

Add `.env` file, e.g.:

```ini
DB_URI=mongodb://mongo1:30001,mongo2:30002,mongo3:30003/?replicaSet=my-replica-set
DB_NAME=store
DB_CUSTOMERS_COLLECTION_NAME=customers
DB_CUSTOMERS_ANONYMOUS_COLLECTION_NAME=customers_anonymised
CREATION_INTERVAL_IN_MS=200
CREATION_CUSTOMERS_MIN_NUMBER=1
CREATION_CUSTOMERS_MAX_NUMBER=10
WATCH_BATCH_SIZE=1000
WATCH_FLUSH_INTERVAL_IN_MS=1000

```

## Quality check

Use `pnpm run quality:check` to run quality check

## Run

- Use `pnpm run app` to run `app.ts`
- Use `pnpm run sync` to run `sync.ts`
- Use `pnpm run sync:full-reindex` to run `sync.ts` in **Full reindex** mode

## Run in watch mode

- Use `pnpm run app:dev` to run `app.ts`
- Use `pnpm run sync:dev` to run `sync.ts`
- Use `pnpm run sync:full-reindex:dev` to run `sync.ts` in **Full reindex** mode

---

## How was the `tsconfig.json` file generated?

This `tsconfig.json`:

```json
{ "extends": ["@tsconfig/strictest/tsconfig", "@tsconfig/node18/tsconfig"] }
```

is broken due to [ts-node issue#2000](https://github.com/TypeStrong/ts-node/issues/2000)

So the current `tsconfig.json` is created by merging the two configurations:

- [@tsconfig/strictest](https://github.com/tsconfig/bases/blob/main/bases/strictest.json)
- [@tsconfig/node18](https://github.com/tsconfig/bases/blob/main/bases/node18.json)
