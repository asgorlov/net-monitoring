const webpackMerge = require("webpack-merge");
const { commonMainConfig } = require("./common");

module.exports = webpackMerge.merge(commonMainConfig("development"), {
  devtool: "eval-cheap-module-source-map",
});
