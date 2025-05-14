import merge from "webpack-merge";
import ESLintPlugin from "eslint-webpack-plugin";
import { commonRendererConfig } from "./common";

module.exports = merge(commonRendererConfig("development"), {
  devtool: "eval-cheap-module-source-map",
  devServer: {
    hot: true,
    port: 3003,
    static: "./dist",
    client: {
      overlay: { warnings: false, errors: true },
    },
  },
  optimization: {
    runtimeChunk: "single",
  },
  plugins: [
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
      emitWarning: true,
      emitError: true,
      cache: true,
    }),
  ],
});
