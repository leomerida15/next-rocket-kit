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
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: "doc",
      label: "Get started 🔛",
      id: "intro",
    },
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
          id: "tools-we-offer/http-module",
        },
        {
          type: "doc",
          id: "tools-we-offer/openapi-module",
        },
      ],
    },
  ],
  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
