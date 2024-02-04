---
sidebar_position: 4
sidebar_label: Http Module 📝
sidebar_class_name: green
---

# Http Module 📝

The Http tool will help you manage http status, to better manage and organize your request responses.

> **Note 📦:** rocket-kit uses the [http-status-codes](https://www.npmjs.com/package/http-status-codes) package

```typescript
const Http = {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
};
```

```typescript
// "path file" ~ ./utils/rocketKit
import { createRocket } from "next-rocket-kit";

export const { Http } = createRocket();
```

```typescript
// "path file" ~ ./src/app/api/route.ts
import { Http } from "@/utils/rocketKit";
import { Route } from "@/utils/Route";

// End Point GET basic
export const GET = Route({
  Handler(req, reply, context) {
    return reply.json(
      {
        message: Http.ReasonPhrases.OK, // "OK"
      },
      {
        status: Http.StatusCodes.OK, // 200
      }
    );
  },
});
```
