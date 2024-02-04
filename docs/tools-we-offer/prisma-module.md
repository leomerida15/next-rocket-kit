---
sidebar_position: 3
sidebar_label: Prisma module 📝
sidebar_class_name: green
---

# Prisma module 📝

This module is used to extend the functionality of @prisma/client and prisma.

```typescript
import { PrismaClient } from "@prisma/client";

const { prisma } = onPrisma(PrismaClient);
```

```typescript
// "path file" ~ ./utils/rocketKit
import { createRocket } from "next-rocket-kit";
export const rocket = createRocket();
export const { Http } = rocket;
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
