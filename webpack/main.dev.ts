import merge from "webpack-merge";
import ESLintPlugin from "eslint-webpack-plugin";
import { commonMainConfig } from "./common";

module.exports = merge(commonMainConfig("development"), {
  devtool: "eval-cheap-module-source-map",
  plugins: [
    new ESLintPlugin({
      extensions: ["js", "jsx", "ts", "tsx"],
      emitWarning: true,
      emitError: true,
      cache: true,
    }),
  ],
});
