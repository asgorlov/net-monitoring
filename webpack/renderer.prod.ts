import merge from "webpack-merge";
import { commonRendererConfig } from "./common";

module.exports = merge(commonRendererConfig("production"));
