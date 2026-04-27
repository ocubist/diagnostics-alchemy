# http-request-handler — Deep Analysis

**Package:** `@ocubist/http-request-handler` v0.2.2  
**Status:** Built, but has 554 lines of commented-out old implementation and stale internal deps  
**Verdict:** Peripheral to alchemy-diagnostics. The core idea is sound but there are better alternatives. Only relevant if the logger needs to ship logs to a remote endpoint.

---

## What It Does

A typed, Zod-validated HTTP client built on Axios. The main entry point is `useHttpRequestHandler`, which is a factory that returns `craft*Request` functions for each HTTP method.

```typescript
const handler = useHttpRequestHandler({
  baseUrl: "https://api.example.com",
  timeout: 5000,
  retryOptions: { retries: 3, initialDelay: 100, backoffMultiplier: 2 },
  logger: ({ method, url, status, duration }) => console.log(...),
});

const getUser = handler.craftGetRequest<
  { userId: string },  // path params
  {},                  // query params
  { name: string }     // response body
>({
  endpointTemplate: "/users/:userId",
  pathParamsSchema: z.object({ userId: z.string() }),
  queryParamsSchema: z.object({}),
  responseBodySchema: z.object({ name: z.string() }),
});

const result = await getUser({ pathParams: { userId: "123" }, queryParams: {} });
// result.data.name is typed as string
// result.success, result.status, result.duration, result.attempts all available
```

---

## Architecture

### Request Pipeline

Every `craft*Request`-generated function runs through `makeHttpRequest`, which:

1. **Validate timeout** — `parseTimeout(params.timeout)`
2. **Validate retry options** — `parseRetryOptions(params.retryOptions)`
3. **Validate path params** — `parsePathParams(val, zodSchema)`
4. **Build URL** — `parseUrl(replacePathParams(urlTemplate, pathParams))`
5. **Validate query params** — `parseQueryParams(val, zodSchema)`
6. **Validate request body** — `parseRequestBody(val, zodSchema)`
7. **Merge headers** — `mergeHeadersWithDefaults(headers)`
8. **Execute Axios request** with retry loop
9. **Validate response** — `parseResponseBody(data, zodSchema)`
10. **Log** — calls optional `logger` callback with request/response details
11. **Return typed `HttpResponse`** object

### Retry Logic

Exponential backoff implemented manually:

```typescript
for (attempts = 1; attempts - 1 <= retryOptions.retries; attempts++) {
  try {
    const response = await axios(config);
    return buildHttpResponse(response, attempts);
  } catch (err) {
    if (isAxiosError(err)) {
      const isRetriable = !err.response || checkResponseFor5xx(err.response);
      if (isRetriable) {
        const delay =
          retryOptions.initialDelay *
          Math.pow(retryOptions.backoffMultiplier, attempts - 1);
        await sleep(delay);
        continue;
      } else {
        throw axiosErrorTransmuter.transmute(err); // 4xx → typed error immediately
      }
    }
    throw err;
  }
}
```

Retries on network errors and 5xx responses; throws immediately on 4xx.

### Error Taxonomy

All errors are crafted with `useErrorAlchemy`:

**Request validation errors** (thrown before request):

- `QueryParsingError`
- `RequestBodyParsingError`
- `PathParameterParsingError`
- `UrlValidationError`
- `InvalidTimeoutError`
- `RetryOptionsParsingError`

**Response errors** (thrown during/after request):

- `HttpResponseError` — 4xx/5xx with status code in payload
- `NetworkError` — no response (connection refused, DNS failure)
- `TimeoutError` — `ECONNABORTED` (Axios timeout)
- `UnexpectedAxiosError` — catch-all for unknown Axios errors

**Response validation error:**

- `ResponseParsingError` — response body failed Zod validation

**Fallback:**

- `UnexpectedError` — anything that doesn't match the above

### `HttpResponse<TPathParams, TQueryParams, TRequestBody, TResponseBody>`

The rich typed return object:

```typescript
{
  success: boolean,
  data: TResponseBody,
  status: number,
  statusText: string,
  headers: Record<string, string>,
  url: string,
  duration: number,       // milliseconds
  attempts: number,       // how many tries were made
  axiosConfig: AxiosRequestConfig,
  requestProps: { url, headers, method, pathParams, queryParams, requestBody, ... },
  originalRequestProps: MakeHttpRequestProps,
}
```

### Logger Interface

```typescript
type Logger = (params: {
  attempts?: number;
  method: Method;
  success: boolean;
  urlTemplate: string;
  headers?: Headers;
  requestBody?: unknown;
  responseBody?: unknown;
  status?: number;
  url?: string;
  duration?: number;
}) => void;
```

Both request handlers and the factory accept a logger callback — meaning you can plug in your logger at both the handler level (all requests) and the individual request level.

### Available HTTP Methods

`craftGetRequest`, `craftPostRequest`, `craftPutRequest`, `craftDeleteRequest`, `craftPatchRequest`, `craftOptionsRequest`, `craftHeadRequest`, `craftPurgeRequest`, `craftLinkRequest`, `craftUnlinkRequest`

---

## Problems Found

### 1. 554 Lines of Commented-Out Code in `useHttpRequestHandler.ts`

The entire original implementation (the one that was replaced) is commented out in the file. This should be deleted.

### 2. Stale Internal Dependency Versions

```json
"@ocubist/error-alchemy": "^0.7.4",   // current: 0.9.2
"@ocubist/utils": "^0.5.8",            // current: 0.6.2
```

These are over 2 minor versions behind, which could cause version conflicts in a monorepo.

### 3. Axios Is CJS

`axios` v1.x ships CJS as its primary format (there's an ESM build, but it's not the default). In a strict ESM environment, this can cause issues depending on the bundler and setup.

**Better alternatives:**

- `ky` (7kB, pure ESM, browser+Node, built on native `fetch`) — drop-in spirit if API is acceptable
- `ofetch` (by UnJS, ESM-first, used by Nuxt/Nitro) — similar philosophy to this package
- Native `fetch` (Node 18+) + manual retry/validation

### 4. `console.log` in Test Files

`useHttpRequestHandler.test.ts:279` has an active `console.log(result)`. Minor, but sloppy.

### 5. `performance.now()` Availability

`performance.now()` is globally available in Node 16+. The package targets Node without specifying a minimum version. This is fine for modern environments but worth documenting.

### 6. CJS-only Build

No `exports` field in package.json.

---

## What's Genuinely Good

- **The validation pipeline** — validating path params, query params, request body, AND response body with Zod schemas is the killer feature. This gives end-to-end type safety for API calls.
- **Retry with exponential backoff** — correctly differentiates 4xx (don't retry) from 5xx/network (do retry).
- **Rich typed response** — `duration`, `attempts`, `requestProps` in the response is excellent for logging and debugging.
- **The `logger` callback** — passing a logger function into the handler is a clean, non-invasive pattern.
- **Error taxonomy** — having named, typed errors for every failure mode is consistent with the error-alchemy philosophy.

---

## Is There a Better Package?

**`zodios`** does almost exactly what this package does — typed, Zod-validated HTTP client — and is more mature, well-maintained, and ESM-compatible. It also generates OpenAPI specs and has a full plugin system.

However, `zodios` is heavier (it's a framework, not a utility). For simple use cases, this package's `useHttpRequestHandler` API is more lightweight.

**`ky`** is a better choice if you don't need Zod validation baked in. You can add Zod validation manually in 10 lines.

---

## Relevance to alchemy-diagnostics

**Low.** The http-request-handler is only relevant to alchemy-diagnostics if you want the logger to:

- Send logs to a remote HTTP endpoint (e.g., a log aggregation service)
- Upload error reports to an API

If that's a use case, the approach should be:

- Use `ky` or native `fetch` (ESM-native, lighter)
- Add Zod validation for the request/response if needed
- Do NOT bring in Axios

The error taxonomy (typed HTTP errors) from this package could be useful as a reference for how to define errors in alchemy-diagnostics, but the implementation doesn't need to be imported.
