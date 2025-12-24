import path from "path";
import nodeExternals from "webpack-node-externals";
import { Configuration } from "webpack";

const config: Configuration = {
  entry: "./src/index.ts",   // starting point of your Lambda
  target: "node",              // bundle for Node.js environment
  mode: "production",          // optimized build
  externals:  {
  "aws-sdk": "commonjs aws-sdk"
},// don’t bundle node_modules (Lambda has AWS SDK preinstalled)
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // so imports don’t need file extensions
  },
  output: {
    path: path.resolve(__dirname, "dist"), // final folder
    filename: "index.js",                  // final file
    libraryTarget: "commonjs2",            // required for Lambda
  },
};

export default config;
