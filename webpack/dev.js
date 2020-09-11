const { merge } = require("webpack-merge");
const path = require("path");

const base = require("./base");

module.exports = merge(base, {
  watch: true,
  mode: "development",
  devtool: "eval-cheap-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    writeToDisk: true,
  },
});
