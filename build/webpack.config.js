'use strict';
const os = require('os');
const path = require('path');
const webpack = require('webpack');

__dirname = path.resolve(__dirname, ".."); // process.cwd();
const cfg = {
    "path": {
        "api": "./api/",
        "src": "./src/",
        "build": "./.build/"
    },
};

const WebpackNotifierPlugin = require('webpack-notifier');
const {CleanWebpackPlugin}  = require('clean-webpack-plugin');
const CopyWebpackPlugin   = require('copy-webpack-plugin');
const HtmlWebpackPlugin   = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


// env variables
process.env.WEBPACK = true;

let mode = process.env.NODE_ENV || "development";
let argvModeIndex = process.argv.findIndex(v => v === "--mode");
if (~argvModeIndex) {
    mode = process.argv[argvModeIndex + 1];
}
console.log("MODE:", mode)

module.exports = {
    context: path.resolve(__dirname, cfg.path.src),
    entry: {
        playcanvas: "playcanvas/index.js",
    },
    output: {
        path: path.resolve(__dirname, cfg.path.build),
        publicPath: '/',
        filename: '[name].[hash].js',
        library: '[name]'
    },
    devServer: {
        host: "0.0.0.0",
        public: "localhost:8080",
        open: true,
        hot: true,
        disableHostCheck: true,
        historyApiFallback: true,
        contentBase: [cfg.path.src, "./.public"],
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        stats: 'minimal',
    },
    resolve: {
        modules: [
            path.join(__dirname, "src"),
            "node_modules",
        ],
        alias: {
            "@": path.join(__dirname, "src"),
            "utils": path.join(__dirname, "utils"),
        }
    },
    module: {
        rules: [
            { test: /\.(pug|jade)$/, loader: "pug-loader", options: {} },
            { test: /\.css$/, use: [ {loader: MiniCssExtractPlugin.loader, options: {hmr: mode === "development"}}, "css-loader" ] },
            { test: /\.styl$/, use: [ {loader: MiniCssExtractPlugin.loader, options: {hmr: mode === "development"}}, "css-loader", "stylus-loader"] },
            { test: /\.glsl|.vert|.frag$/, loader: "webpack-glsl-loader" },
            { // pictures and fonts
                test: /\.(jpeg|jpg|png|gif|woff2?|svg|ttf|eot|fnt)$/i,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]",
                    esModule: false,
                }
            },
            { // 3d assets
                test: /\.(gltf|glb|fbx|obj|mtl|dat|patt)$/i,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]"
                }
            },
            { // icon fonts
                test: /\.?font\.js/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'webfonts-loader'
                ]
            }
        ],
        noParse: /\.min\.js$/
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackNotifierPlugin({excludeWarnings: true}),
        new webpack.HotModuleReplacementPlugin(),

        new webpack.LoaderOptionsPlugin({
            debug: true
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'playcanvas/index.pug',
            inject: 'body',
        }),

        new MiniCssExtractPlugin({
            filename: mode === "development" ? "[name].css" : "[name].[hash].css"
        }),

        new CopyWebpackPlugin([
            { from: 'favicon.*' },
            // { from: 'robots.txt' },
        ]),

        new webpack.DefinePlugin({
            VERSION: JSON.stringify( require("../package.json").version ),
            REVISION: JSON.stringify( require("child_process").execSync('git rev-parse --short HEAD').toString().trim() ),
            BRANCH: JSON.stringify( require("child_process").execSync('git rev-parse --abbrev-ref HEAD').toString().trim() ),
            BUILD_DATE: JSON.stringify( new Date().toJSON() ),
        }),
    ]
}
