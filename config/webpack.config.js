const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'development',
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
    devServer: {
        contentBase: "./dist", //资源文件目录
        open: true, //自动打开浏览器
        hot: true,
        port: 8081, //服务器端口,
        hotOnly: true,
        proxy: {
            "/api": {
                target: "http://localhost:8082"
            }
        }
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
        new webpack.HotModuleReplacementPlugin()

    ]
}