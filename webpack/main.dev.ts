import merge from "webpack-merge";
import { commonMainConfig } from "./common";

module.exports = merge(commonMainConfig("development"), {
  devtool: "eval-cheap-module-source-map",
});
