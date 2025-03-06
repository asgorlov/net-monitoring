const webpackMerge = require("webpack-merge");
const { commonRendererConfig } = require("./common");

module.exports = webpackMerge.merge(commonRendererConfig("production"), {});
