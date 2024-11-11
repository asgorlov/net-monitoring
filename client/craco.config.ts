import type { Configuration as WebpackConfig } from "webpack";
import path = require("path");

export default module.exports = {
  webpack: {
    configure: (webpackConfig: WebpackConfig, params: any) => {
      // Removing dev server startup freeze
      if (params.env === "development") {
        webpackConfig.output = {
          ...webpackConfig.output,
          filename: "static/js/[name].bundle.js"
        };
      }

      // Change build folder
      const newBuildFolderPath = path.resolve("../public");
      params.paths.appBuild = newBuildFolderPath;
      if (webpackConfig.output) {
        webpackConfig.output.path = newBuildFolderPath;
      }

      return webpackConfig;
    }
  }
};
