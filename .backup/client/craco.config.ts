import type { Configuration as WebpackConfig } from "webpack";

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

      return webpackConfig;
    }
  }
};
