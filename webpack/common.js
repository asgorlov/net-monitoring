const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const commonMainConfig = (mode) => {
  return {
    mode,
    entry: {
      main: "./src/main/main.ts",
      preloader: "./src/main/preloader.ts",
    },
    target: "electron-main",
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, "..", "dist/main"),
      filename: "[name].js",
    },
    resolve: {
      extensions: [".js", ".ts", ".json"],
    },
  };
};

const commonRendererConfig = (mode) => {
  return {
    mode,
    entry: "./src/renderer/index.tsx",
    target: mode === "production" ? "electron-renderer" : "web",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: /src/,
          use: [{ loader: "babel-loader" }],
        },
        {
          test: /\.s[ac]ss$/i,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, "..", "dist/renderer"),
      filename: mode === "production" ? "renderer.js" : "[name].js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/renderer/index.html",
      }),
    ],
    resolve: {
      extensions: [".js", ".ts", ".tsx", ".json"],
    },
  };
};

module.exports = {
  commonMainConfig: commonMainConfig,
  commonRendererConfig: commonRendererConfig,
};
