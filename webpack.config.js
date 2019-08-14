const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "cheap-eval-source-map",

  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: {
    othello: "./src/ts/main.ts"
  },
  output: {
    path: path.resolve("./dist/js/"),
    filename: "[name].[chunkhash].js"
  },

  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: "ts-loader"
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
      filename: path.join(__dirname, "dist/index.html"),
      inject: true
    })
  ],

  // import 文で .ts ファイルを解決するため
  resolve: {
    extensions: [".ts"]
  }
};
