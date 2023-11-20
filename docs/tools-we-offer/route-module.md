---
sidebar_position: 2
sidebar_label: Route Module 🔃
sidebar_class_name: green
---

# Route Module 🔃

This tool helps to quickly create an endpoint using the **next.js** **API** folder.

- We create the rocket to be able to access the tools in the kit.

  "path file" ~ ./libs/rocketKit/tools

  ```typescript
  import { createRocket } from "next-rocket-kit";

  export const { onRoute, http, OpenApi } = createRocket();
  ```

- We define the router which should be used on the server side only, for this next.js gives us the comment function ```use serve```.

  ```typescript
  "path file" ~ ./libs/rocketKit/Route

  "use serve"

  import { onRoute } from "./tools";

  export const { Route } = onRoute();
  ```

- We define barrel file.

  ```typescript
  "path file" ~ ./libs/rocketKit/index

  export * from './tools';
  export * from './Route';
  ```

- We define a basic endPoint.

  ```typescript
  // "path file" ~ ./src/app/api/Route.ts

  import { Route } from "@/libs/rocketKit";

  // End Point GET basic
  export const GET = Route({
    Handler(req, reply, context) {
      return reply.json({ message: "Hello World!" }, { status: 201 });
    },
  });
  ```

## Configuration object for Route

- **Handler:** is the function that is executed when calling the end point. With the rocket **Route** it is much easier for us to create endpoints, such as a GET method endpoint.
  The handler function receives three parameters to handle and control the request video cycle, these parameters are as follows.

  - req: Everything that arrives from the client and gives access to all the native methods of **NextRequest**.

  Rocket functions in req.

  - req.getBody(): return body.

  - req.getQuery(): return queries.

  - req.getContext(): return context include path params.

  - req.getHeaders(): return headers.

  - reply: used to reply to the client and gives access to all the native methods of **NextResponse**.

  - context (The native context of **nextjs**)

- **Schema (Schema valid):**
  The schemas attribute allows you to validate the type and format of the data that enters and leaves the **Route**, to handle these validations **Route** is compatible with two possible third party libraries, **"zod"** and **"yup"**. By default, `createRocketKit()` uses **"zod"** as the validation library.

  ```typescript
  // "path file" ~ ./src/app/api/route.ts
  import { Route } from "@/libs/Route";

  // End Point GET basic
  export const POST = Route({
    schemas: {
      body: Schema,
      query: Schema,
      context: Schema,
      headers: Schema,
      response: Schema,
    },
    Handler(req, reply, context) {
      return reply.json({ message: "Hello World!" }, { status: 201 });
    },
  });
  ```

The Schemas attribute uses a life cycle to execute the validations, the order of that life cycle is as follows.

```text
(headers) --> (context) --> (query) --> (body) --> (Handler) --> (response)
```
