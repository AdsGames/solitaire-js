const { merge } = require("webpack-merge");
const base = require("./base");

module.exports = merge(base, {
  mode: "production",
  performance: {
    maxEntrypointSize: 9000000,
    maxAssetSize: 9000000,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
});
