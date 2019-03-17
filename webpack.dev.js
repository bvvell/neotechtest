const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: "./src/index.js",

    output: {
        filename: "assets/js/main.[hash].js",
        path: path.resolve(__dirname, "dist"),
    }, 
    devServer: {
        contentBase: path.join(__dirname, "dist"),
    },
    module: {
        rules: [

            //js
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["env"]
                }
            },
            //css
            {
                test: /\.(scss)$/,
                use: [
                    "style-loader",
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            //images
            {
                test: /\.(png|jpg|gif|webp)$/,
                include: [
                    path.resolve(__dirname, 'src/images'),
                ],
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: 'assets/images',
                            publicPath: '../images'
                        },
                    },

                ]
            },
            {
                test: /\.svg$/,
                include: [
                    path.resolve(__dirname, 'src/images/svg'),
                ],
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            outputPath: 'assets/images',
                            publicPath: '../images'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(path.resolve(__dirname, "dist")),
        new MiniCssExtractPlugin({
            filename: "assets/css/main.css"
        }),
        new CopyWebpackPlugin([
            {
                from: "src/images/",
                to: "assets/",
                flatten: false
            },
            {
                from: "src/json/",
                to: "assets/json/",
                flatten: false
            }
        ]),

        new HtmlWebpackPlugin({
            template: "./index.html",
            inject: true,
            minify: true
        })
    ]
};
