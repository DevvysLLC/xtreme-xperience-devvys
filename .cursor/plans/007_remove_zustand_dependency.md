# Remove Zustand Dependency

## Purpose

Remove external state stores and standardize feature state management on TanStack Query + Repository pattern.

This applies to all features.

All domain types and Zod schemas must live in `src/io`. Do not define or export domain types or schemas from feature folders.

## Architectural Standard

- React Query cache is the single reactive source of truth
- Repository layer handles persistence only
- Storage (localStorage / DB) is not reactive
- No manual subscriptions
- No cross-hook coupling
- No store rehydration patterns

## Required Feature Structure

    /features/<feature-name>
      keys.ts
      config.ts
      utils.ts
      repository.ts
      use-feature.ts
      use-feature-set-*.ts
      use-feature-clear-*.ts

Rules:

- Flat directory
- One hook per file
- No store folders
- No shared state modules

## Type and Schema Rule

- All domain types must be added in `src/io`
- All Zod schemas must be added in `src/io`
- Feature folders must only import types/schemas from `src/io`
- Do not create ad-hoc `type FeatureState = ...` in feature folders

This ensures a single source of truth for domain shapes.

## Logging Requirements

Use the shared logger for:

- All repository read operations
- All mutations (at least `onMutate` and `onSuccess`; include `onError` where applicable)

Import:

```ts
import { logger } from '../../core/logger/logger'
```

Pattern:

```ts
logger.info({ data }, 'label')
```

Guidance:

- Use stable labels: `feature: repo.read`, `feature: mutation.onMutate`, `feature: mutation.onSuccess`, `feature: mutation.onError`
- Do not log entire large payloads unless necessary; prefer IDs, counts, and key fields

## keys.ts

Query keys only.

```ts
export const FEATURE_QUERY_KEY = ['feature'] as const
```

Nothing else belongs here.

## repository.ts

Responsibilities:

- Import `FeatureState` from `src/io`
- Import Zod schema from `src/io`
- Define `initialState` (if it is a domain shape, it belongs in `src/io`; otherwise keep it minimal here)
- Implement validate-or-reset persistence
- Expose:
  - `read()`
  - `write()`
  - `clear()`

Constraints:

- No migrations
- No versioning
- No React imports
- No business logic
- Invalid or corrupted storage must reset to `initialState`
- Persistence implementation must be swappable

Logging (required):

- `read()` must log result (or summary) every time it is called

Example:

```ts
logger.info({ data }, '<feature>: repo.read')
```

## use-feature.ts

Read hook.

```ts
useQuery({
  queryKey: FEATURE_QUERY_KEY,
  queryFn: repository.read,
  staleTime: Infinity,
  gcTime: Infinity,
  initialData: initialState
})
```

This is the only reactive state source.

## Mutation Standard

Every mutation hook must:

- Validate using schemas from `src/io`
- Read base from cache
- Create next state
- Call `setQueryData`
- Persist via repository

Required pattern:

```ts
const base = qc.getQueryData(KEY) ?? initialState
const next = { ...base, ...patch }

qc.setQueryData(KEY, next)
await repository.write(next)
```

Do not use `invalidateQueries` unless the updated state is unknown.

Logging (required):

- Log in `onMutate` and `onSuccess`
- Log in `onError` for failures

Example:

```ts
logger.info({ data }, '<feature>: mutation.onSuccess')
```

## setQueryData vs invalidateQueries

- `setQueryData` — immediate UI update, no network call — default behavior
- `invalidateQueries` — triggers refetch — use only when mutation response does not contain updated resource

Default rule: use `setQueryData`.

## Derived State

- Must remain pure
- Must live in `utils.ts`
- Must not be persisted
- Must not duplicate canonical state

## Migration Plan

- Step 1: Remove all external store usage
- Step 2: Move/confirm all domain types and schemas exist in `src/io`. Do not proceed until the feature folder imports types/schemas exclusively from `src/io`
- Step 3: Create `repository.ts` that imports existing types and schemas from `src/io`, implements validate-or-reset persistence, and logs every `read()` call
- Step 4: Implement `use-feature.ts` using React Query
- Step 5: Rewrite all mutation hooks to follow the required mutation pattern and add required mutation logging
- Step 6: Migrate all existing custom hooks:
  - Remove direct store access
  - Remove subscription logic
  - Remove cross-hook dependencies
  - Replace reads with `use-feature`
  - Replace writes with standardized mutation hooks
- Step 7: Do not edit components or remove old implementations yet, that will come next

## Expected Outcome

After migration:

- All features use identical state pattern
- State is fully reactive via React Query
- Persistence is abstracted and swappable
- No feature depends on another feature's internal state
- No rehydration-driven logic exists
- Logging exists for repository reads and mutations

## Final Model

    Mutation → setQueryData → UI updates
                ↓
            repository.write
                ↓
            Storage / DB

React Query cache is truth. Storage is persistence only.

If implementation requires:

- Manual subscriptions
- Reading storage in components
- Hook chaining for state synchronization
- Immediate invalidation after mutation

The architecture is being violated.
