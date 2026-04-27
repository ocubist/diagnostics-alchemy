# HTTP Request Handler

## Description

The HTTP Request Handler is a flexible and powerful library for crafting and executing HTTP requests in TypeScript. It provides a set of customizable hooks and utilities for handling various HTTP methods, response parsing, and error handling. This library leverages the `@ocubist/error-alchemy` package for robust error handling and utilizes `Zod` schemas extensively to ensure advanced type-safety with comprehensive type inference.

## Installation

To install the HTTP Request Handler, use npm or yarn:

```bash
npm install @ocubist/http-request-handler
# or
yarn add @ocubist/http-request-handler
```

## Usage

### Basic Example

```ts
import { useHttpRequestHandler } from "@ocubist/http-request-handler";
import { z } from "zod";

// Define your Zod schemas
const pathParamsSchema = z.object({
  userId: z.string(),
});

const queryParamsSchema = z.object({
  includePosts: z.boolean(),
});

const responseBodySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

// Initialize the HTTP request handler
const { craftGetRequest } = useHttpRequestHandler({
  baseUrl: "https://api.example.com",
});

// Craft a GET request
const getUser = craftGetRequest({
  pathParamsSchema,
  queryParamsSchema,
  responseBodySchema,
  endpointTemplate: "/users/{userId}",
});

// Use the crafted request function
const fetchUser = async (userId: string) => {
  try {
    const response = await getUser({
      pathParams: { userId },
      queryParams: { includePosts: true },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

const userResponse = await fetchUser("123");

if (userResponse) {
  const { id, name, email } = userResponse.data;
  console.log(`Fetched user '${name}' with id '${id}' and email '${email}'`);
  // Fetched user 'USER_NAME' with id '123' and email 'EMAIL'
}
```

### Advanced Example with POST Request

```ts
import { useHttpRequestHandler } from "@ocubist/http-request-handler";
import { z } from "zod";

// Define your Zod schemas
const pathParamsSchema = z.object({
  userId: z.string(),
});

const queryParamsSchema = z.object({});

const requestBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const responseBodySchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    user: z.object({
      userId: z.string(),
      name: z.string(),
      email: z.string(),
    }),
    post: z.object({
      postId: z.string(),
      title: z.string(),
      content: z.string(),
    }),
  }),
});

// Initialize the HTTP request handler
const { craftPostRequest } = useHttpRequestHandler({
  baseUrl: "https://api.example.com",
});

// Craft a POST request
const createPost = craftPostRequest({
  pathParamsSchema,
  queryParamsSchema,
  requestBodySchema,
  responseBodySchema,
  endpointTemplate: "/users/{userId}/posts",
});

// Use the crafted request function
const submitPost = async (userId: string, title: string, content: string) => {
  try {
    const response = await createPost({
      pathParams: { userId },
      queryParams: {},
      requestBody: { title, content },
    });
    return response;
  } catch (error) {
    console.error("Error creating post:", error);
  }
};

const postResponse = await submitPost(
  "123",
  "Hello World",
  "This is my first post."
);

if (postResponse) {
  const { user, post } = postResponse.data;
  console.log(
    `Post by user '${user.name}' with id '${user.userId}' and title '${post.title}': "${post.content}"`
  );
  // Post by user 'USER_NAME' with id '123' and title 'Hello World': "This is my first post."
}
```

## API Documentation

[Docs](https://ocubist.github.io/http-request-handler/)

## License

The HTTP Request Handler is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for more information.
