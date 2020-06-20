const path = require('path');
const merga = require('webpack-merge');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const proConfig = require('./webpack.pro.js');
const devConfig = require('./webpack.dev.js');

const baseConfig = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, "./src"),
                loader: "babel-loader"
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new htmlWebpackPlugin({
            title: '云飞-webpack',
            filename: 'index.html',
            template: './public/index.html'
        }),
        new CleanWebpackPlugin(),
    ]
}

module.exports = (env) => {
    console.log(env)
    if (env && env.production) {
        return merga(baseConfig, proConfig)
    } else {
        return merga(baseConfig, devConfig)
    }
}