---
sidebar_position: 2
sidebar_label: Get started 🚀
sidebar_class_name: green
---

# Configuration object 🔩🔧

Using our rocket kit is very simple, you just have to follow these steps and that's it.

- Install.

  To install you must use the following scripts

  npm: 
  ```typescript
  npm i next-rocket-kit
  ```

  pnpm: 
  ```typescript
  pnpm add next-rocket-kit
  ```

  yarn: 
  ```typescript
  yarn add next-rocket-kit
  ```

  bun: 
  ```typescript
  bun add next-rocket-kit
  ```

- Open kit
    
    We must open our kit to use its tools, we can do it as follows, we import the createRocket function and destroy its response, each one will be a tool.

    > **Note 🧪:** You can use the kit configuration [object](./configuration-object.md) to define which libraries and versions you will use with your.

    ```typescript
    import { createRocket } from "next-rocket-kit";

    export const { onRoute, Http, OpenApi, onPrisma } = createRocket();
    ```