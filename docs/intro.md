---
sidebar_position: 1
sidebar_label: Get started 🔛
sidebar_class_name: green
---

# Get started 🔛

This object is used to define types and versions of the tools.

## Install

- npm

  ```bash
  pnpm i next-rocket-kit
  ```

- pnpm

  ```bash
  pnpm add next-rocket-kit
  ```

- yarn

  ```bash
  yarn add next-rocket-kit
  ```

## Create the rocket

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
