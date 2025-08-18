const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: true, // for prod
  configureWebpack: {
    devtool: "source-map", // for dev (usually default)
  },
  pages: {
    index: {
      entry: "src/main.js",
      title: "Granny's Recipes",
    },
  },
});
