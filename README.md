# Fundraise Up backend test

## Build

- [install pnpm](https://pnpm.io/installation)
- install dependencies via `pnpm i`

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
