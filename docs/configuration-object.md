---
sidebar_position: 1
sidebar_label: Configuration Object 🔩🔧
sidebar_class_name: green
---

# Configuration object 🔩🔧

This object is used to define types and versions of the tools.

- Default object.
  In the event that the user does not place a configuration object, this will be the object that will be used by default in the kit.

  ```typescript
  import { ConfigObject } from "next-rocket-kit";

  const configObject: ConfigObject = {
    resolver: "zod",
    oas: "3.1",
  };
  ```
