const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function(env) {
  const NODE_ENV = env.NODE_ENV || "production";
  const IS_DEV = NODE_ENV === "development";
  const babelPlugins = [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: false }],
    ["babel-plugin-react-scoped-css"]
  ];
  const babelLoader = {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      babelrc: false,
      presets: [
        [
          "@babel/preset-env",
          {
            targets: { browsers: "last 2 versions", "ie": "11" },
            useBuiltIns: "entry",
            corejs: 3
          },
        ],
        "@babel/preset-react",
      ],
      plugins: babelPlugins,
    }
  };

  return {
    entry: "./src/index.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js",
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    },
    devServer: {
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /(\.d)?\.tsx?$/,
          include: [path.resolve(__dirname, "src"), path.resolve(__dirname, "types")],
          use: [
            babelLoader,
            {
              loader: "ts-loader",
              options: {
                transpileOnly: IS_DEV,
                configFile: "tsconfig.json"
              }
            }
          ]
        },
        {
          test: /\.(sc|sa)ss$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                importLoaders: 2,
              },
            },
            {
              loader: "scoped-css-loader",
            },
            {
              loader: "postcss-loader",
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
          loader: "url-loader",
          options: {
            limit: 1024,
          },
        },
        {
          test: /\.svg/,
          use: {
            loader: "svg-url-loader",
            options: {
              limit: 1024
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
      }),
    ],
  }
}