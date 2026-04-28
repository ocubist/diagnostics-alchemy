# Origins

`@ocubist/diagnostics-alchemy` consolidates a monorepo of 7 earlier packages that were all scaffolding for one goal: a structured logger deeply integrated with a typed error system.

The relevant predecessors:

| Old package | What it became |
|---|---|
| `error-alchemy` | `src/errors/` — ported and modernized (bugs fixed, ESM, vitest) |
| `utils` (objectify, objectifyError) | `src/logger/formatters/objectifyError.ts` |
| `file-stream-manager` | Internalized — `NodeTransport` uses SonicBoom directly |
| `logger` | `src/logger/` — never implemented in the old monorepo, built from scratch here |

Dropped entirely: `singleton-manager` (ESM modules are singletons), `event-handler` (replaced by callbacks), `http-request-handler` (fetch covers it).

Full analysis of the old packages lives in `.archive/docs/`.
