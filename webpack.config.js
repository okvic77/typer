var path = require("path");
var webpack = require("webpack");

const del = require('del');
del.sync(['dist']);

const renders = [
  {
    filename: "[name].js",
    plugins: [new webpack.SourceMapDevToolPlugin({ filename: "[name].js.map" })]
  },
  {
    filename: "[name].min.js",
    plugins: [new webpack.optimize.UglifyJsPlugin()]
  }
];

module.exports = renders.map(({ filename, plugins }) => {
  return {
    entry: { typer: "./Typer" },
    context: path.resolve(__dirname, "lib"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename,
      library: "ReactTyper",
      libraryTarget: "umd"
    },
    plugins,
    module: {
      loaders: [
        {
          test: /\.js?$/,
          loader: "babel-loader",
          query: { presets: ["react", "latest", "stage-0"] }
        }
      ]
    },
    externals: {
      react: "React"
    }
  };
});
