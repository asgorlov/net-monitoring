import merge from "webpack-merge";
import { commonRendererConfig } from "./common";

module.exports = merge(commonRendererConfig("development"), {
  devtool: "eval-cheap-module-source-map",
  devServer: {
    port: 3003,
    static: "./dist",
    client: {
      overlay: { warnings: false, errors: true },
    },
  },
  optimization: {
    runtimeChunk: "single",
  },
});
