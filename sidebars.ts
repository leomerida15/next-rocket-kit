import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {

  tutorialSidebar: [
    // {
    //   type: "doc",
    //   label: "Next Rocket Kit 🚀",
    //   id: "intro",
    // },
    {
      type: "doc",
      label: "Configuration Object 🔩🔧",
      id: "configuration-object",
    },
    {
      type: "category",
      label: "Tools We Offer 🔧🔨",
      link: {
        type: "doc",
        id: "tools-we-offer/note",
      },
      items: [
        {
          type: "doc",
          id: "tools-we-offer/route-module",
        },
        {
          type: "doc",
          id: "tools-we-offer/prisma-module",
        },
        {
          type: "doc",
          id: "tools-we-offer/http-module",
        },
        {
          type: "doc",
          id: "tools-we-offer/openapi-module",
        },
      ],
    },
  ],
};

export default sidebars;
