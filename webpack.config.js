// Bringing in the path module just so I can use the full path
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Easily create HTML files to serve my bundles
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  mode: "production",
  // mode: "development",

  // The entry is the input that Webpack will look at it, and work on it so that it will give us the output
  entry: {
    index: path.resolve(__dirname, "./src/js/index.js"),
    insideGame: path.resolve(__dirname, "./src/js/insideGame.js"),
  },

  // The output that Webpack will give us
  output: {
    // It will be in this path (directory)
    path: path.resolve(__dirname, "dist"),
    // It will take the name of the entry
    filename: "js/[name].[contenthash].js",
    // It will be clean so that Webpack will not give us a new file whenever we rerun the building command
    clean: true,
    // Any asset will be just like the name of its input and its extension
    assetModuleFilename: "assets/images/[name][ext]",
  },

  // A plugin allows me to tap into the entire compilation life cycle
  plugins: [
    new HtmlWebpackPlugin({
      title: "Connect four game",
      filename: "index.html",
      template: "./src/index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      title: "Connect four game",
      filename: "insideGame.html",
      template: "./src/insideGame.html",
      chunks: ["insideGame"],
    }),
    // new BundleAnalyzerPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/assets"),
          to: path.resolve(__dirname, "./dist/assets"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "styles/style.css",
    }),
  ],

  // This allows me to bundle any static resource way beyond JavaScript
  module: {
    rules: [
      {
        // For any css file use
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      // I use Babel if I want to be backwards compatible for the older browsers
      {
        test: /\.js$/,
        // We add exclude, because we don't want to miss with anything in node_modules
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
    // Makes the changes appear without reloading the page
    hot: true,
    // The server will compress the response data before sending it to the client, reducing the amount of data transferred over the network and improving the overall performance of the application.
    compress: true,
    // The historyApiFallback option tells Webpack to serve the index.html file instead of the 404 page when a requested file is not found. This allows the client-side routing to take over and display the correct page based on the requested URL.
    historyApiFallback: true,
  },
  //Source maps are files that map the generated code back to the original source code, making it easier to debug your application in the browser's developer tools. But it can significantly increase the build time and file size of your application
  devtool: "source-map",
};
