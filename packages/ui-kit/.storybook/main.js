module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["../public"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-postcss",
      options: {
        postcssLoaderOptions: {
          implementation: require("postcss"),
          postcssOptions: {
            plugins: [
              require("tailwindcss")({
                config: "./.storybook/tailwind.config.js",
              }),
              require("autoprefixer")(),
            ],
          },
        },
      },
    },
  ],
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  framework: "@storybook/react",
  webpackFinal: async (config, options) => {
    config.module.rules.find((rule) => rule.test.toString() === "/\\.css$/").exclude =
      /\.module\.css$/;

    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: true,
          },
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                require("tailwindcss")({
                  config: "./.storybook/tailwind.config.js",
                }),
                require("autoprefixer")(),
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};
