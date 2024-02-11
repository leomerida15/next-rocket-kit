"use strict";(self.webpackChunkdocument=self.webpackChunkdocument||[]).push([[1524],{3972:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>r,default:()=>l,frontMatter:()=>s,metadata:()=>a,toc:()=>c});var o=t(2488),i=t(4728);const s={sidebar_position:5,sidebar_label:"OpenAPI Module \ud83d\udcdd",sidebar_class_name:"green"},r="OpenAPI Module \ud83d\udcdd",a={id:"tools-we-offer/openapi-module",title:"OpenAPI Module \ud83d\udcdd",description:'OpenAPI allows you to create a json in openapi "3.0" or "3.1" format, compatible with tools like swagger, postman and anyone that receives the openapi format.',source:"@site/docs/tools-we-offer/openapi-module.md",sourceDirName:"tools-we-offer",slug:"/tools-we-offer/openapi-module",permalink:"/next-rocket-kit/docs/tools-we-offer/openapi-module",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5,sidebar_label:"OpenAPI Module \ud83d\udcdd",sidebar_class_name:"green"},sidebar:"tutorialSidebar",previous:{title:"Http Module \ud83d\udcdd",permalink:"/next-rocket-kit/docs/tools-we-offer/http-module"}},p={},c=[{value:"OpenAPI Example",id:"openapi-example",level:2},{value:"Recommendations for use with third-party packages to OpenAPI",id:"recommendations-for-use-with-third-party-packages-to-openapi",level:3}];function d(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.M)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.h1,{id:"openapi-module-",children:"OpenAPI Module \ud83d\udcdd"}),"\n",(0,o.jsxs)(n.p,{children:["OpenAPI allows you to create a json in openapi ",(0,o.jsx)(n.a,{href:"https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md",children:'"3.0"'})," or ",(0,o.jsx)(n.a,{href:"https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md",children:'"3.1"'})," format, compatible with tools like ",(0,o.jsx)(n.strong,{children:"swagger"}),", ",(0,o.jsx)(n.strong,{children:"postman"})," and anyone that receives the openapi format."]}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Note \ud83d\udce6:"})," rocket-kit uses the ",(0,o.jsx)(n.a,{href:"https://www.npmjs.com/package/openapi3-ts",children:"openapi3-ts"})," package."]}),"\n"]}),"\n",(0,o.jsxs)(n.p,{children:["To define the openapi version you must use the ",(0,o.jsx)(n.strong,{children:"oas"})," attribute in the kit configuration object."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:'// "path file" ~ ./utils/rocketKit\nimport { createRocket } from "next-rocket-kit";\n\nexport const { Http, OpenApi } = createRocket();\n'})}),"\n",(0,o.jsx)(n.h2,{id:"openapi-example",children:"OpenAPI Example"}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:'// "path file" ~ ./utils/rocketKit\nimport { createRocket } from "next-rocket-kit";\n\nexport const rocket = createRocket();\nexport const { Http, OpenApi } = rocket;\n'})}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:'import { OpenApi } from "./utils/rocketkt";\n\n// declare info and openapi version.\nconst openApi = OpenApi({\n  openapi: "3.0.3", // or 3.1.0\n  info: {\n    title: "example",\n    description: "string",\n    termsOfService: "string",\n    contact: {\n      name: "Author",\n    },\n    license: {\n      name: "MIT",\n    },\n    version: "1.0.0",\n  },\n});\n\nopenApi.addSchema("User", {\n  type: "object",\n  properties: {\n    id: {\n      type: "string",\n    },\n    name: {\n      type: "string",\n    },\n  },\n});\n\nopenApi.addPath("/items", {\n  description: "return item list",\n  post: {\n    description: "get items",\n    summary: "get items",\n    requestBody: {\n      description: "body",\n      content: {\n        "application/json": {\n          schema: { $ref: "#/components/schemas/User" },\n        },\n      },\n    },\n    responses: {\n      200: {\n        description: "ok",\n        content: {\n          "application/json": {\n            schema: {\n              type: "object",\n              properties: {\n                id: {\n                  type: "string",\n                },\n              },\n            },\n          },\n        },\n      },\n    },\n  },\n});\n\n// return json string\nopenApi.getSpecAsJson();\n// or return yml stirng\nopenApi.getSpecAsYaml();\n'})}),"\n",(0,o.jsx)(n.h3,{id:"recommendations-for-use-with-third-party-packages-to-openapi",children:"Recommendations for use with third-party packages to OpenAPI"}),"\n",(0,o.jsx)(n.p,{children:'How use OpenAPI with "zod".'}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:[(0,o.jsx)(n.a,{href:"https://www.npmjs.com/package/@anatine/zod-openapi",children:"@anatine/zod-openapi"}),': With this package we can reuse the "zod" validation schemas that you should already be using in the Route schema field to validate the body or some other field of the request.']}),"\n"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-typescript",children:'import { OpenApi } from "@/utils/rocketKit";\nimport { generateSchema, extendZodWithOpenApi } from "@anatine/zod-openapi";\nimport { z } from "zod";\n\n// extend zod\nextendZodWithOpenApi(z);\n\n// declare info and openapi version.\nconst openApi = OpenApi({\n  openapi: "3.0.3", // or 3.1.0\n  info: {\n    title: "example",\n    description: "string",\n    termsOfService: "string",\n    version: "1.0.0",\n    contact: {\n      name: "Author",\n    },\n    license: {\n      name: "MIT",\n    },\n  },\n});\n\nconst ItemZodSchema = z\n  .object({\n    id: z.string().uuid().nonempty().openapi({\n      title: "Item ID",\n      description: "A UUID generated by the server",\n    }),\n    name: z.string().min(2),\n  })\n  .openapi({\n    title: "Item",\n    description: "A item schema",\n  });\n\nconst ItemOpenAPiSchema = generateSchema(ItemZodSchema);\n\nopenApi.addSchema("Item", ItemOpenAPiSchema);\n'})}),"\n",(0,o.jsxs)(n.blockquote,{children:["\n",(0,o.jsxs)(n.p,{children:[(0,o.jsx)(n.strong,{children:"Note \ud83e\uddea:"})," In the case of ",(0,o.jsx)(n.strong,{children:"Yup"})," we have not found a package that meets the standards we are looking for, we remain attentive to options proposed by the community."]}),"\n"]})]})}function l(e={}){const{wrapper:n}={...(0,i.M)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},4728:(e,n,t)=>{t.d(n,{I:()=>a,M:()=>r});var o=t(6651);const i={},s=o.createContext(i);function r(e){const n=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),o.createElement(s.Provider,{value:n},e.children)}}}]);