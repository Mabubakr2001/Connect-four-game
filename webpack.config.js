// Bringing in the path module just so I can use the full path
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  // mode: "production",
  mode: "development",

  // The entry is the input that Webpack will look at it, and work on it so that it will give us the output
  entry: {
    index: path.resolve(__dirname, "./src/js/index.js"),
  },

  // The output that Webpack will give us
  output: {
    // It will be in this path (directory)
    path: path.resolve(__dirname, "dist"),
    // It will take the name of the entry
    filename: "[name].[contenthash].js",
    // It will be clean so that Webpack will not give us a new file whenever we rerun the building command
    clean: true,
    // Any asset will be just like the name of its input and its extension
    assetModuleFilename: "[name][ext]",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Connect four game",
      filename: "index.html",
      template: "./src/index.html",
    }),
    // new BundleAnalyzerPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      // Other rules for loading other asset types
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  devtool: "source-map",
};
