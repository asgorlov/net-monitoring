const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/main/main.ts",
    preloader: "./src/main/preloader.ts",
  },
  target: "electron-main",
  devtool: "eval-cheap-module-source-map",
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
    path: path.resolve(__dirname, "dist/main"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".ts", ".json"],
  },
};
