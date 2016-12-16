var webpack = require('webpack');
var path = require('path');
//根据模板生成HTMl文件
var HtmlWebpackPlugin = require('html-webpack-plugin');
//css单独打包
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//清理文件夹
var CleanWebpackPlugin = require('clean-webpack-plugin');

var precss = require('precss');
var autoprefixer = require('autoprefixer');

//定义了一些文件夹路径
var ROOT_PATH = path.resolve(__dirname);
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
//Template的文件夹路径
var TEM_PATH = path.resolve(SRC_PATH, 'template');

var config = {
    //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
    entry: {
        // 'webpack/hot/dev-server',
        // 'webpack-dev-server/client?http://localhost:8080',
        index: path.resolve(SRC_PATH, 'index.jsx'),
        admin: path.resolve(SRC_PATH, 'admin.jsx'),
        vendors: ['react', 'react-dom', 'react-router']
    },
    //输出的文件名 合并以后的文件名
    output: {
        path: BUILD_PATH,
        publicPath: '/',
        filename: '[name]-[chunkhash:8].js'
    },
    module: {
        loaders: [{
            test: /\.js[x]?$/,
            include: SRC_PATH,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            include: SRC_PATH,
            exclude: /(node_modules|bower_components)/,
            //css单独打包
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules!postcss-loader')
        }, {
            test: /\.(png|jpg)$/,
            //注意后面那个limit的参数，当你图片大小小于这个限制的时候，会自动启用base64编码图片
            loader: 'url?limit=40000&name=[name].[ext]'
        }, {
            test: /\.(eot|woff|svg|ttf|woff2|gif|appcache)(\?|$)/,
            exclude: /(node_modules|bower_components)/,
            loader: 'file-loader?name=[name].[ext]'
        }]
    },
    plugins: [
        //根据模板自动生成HTML文件
        new HtmlWebpackPlugin({
            title: 'SPA-APP-Index',
            filename: 'index.html',
            template: path.resolve(TEM_PATH, 'index.html'),
            hash: true,
            //chunks这个参数告诉插件要引用entry里面的哪几个入口
            chunks: ['index', 'vendors'],
            //要把script插入到标签里
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: 'SPA-APP-Admin',
            filename: 'admin.html',
            template: path.resolve(TEM_PATH, 'admin.html'),
            hash: true,
            chunks: ['admin', 'vendors'],
            inject: 'body'
        }),
        new webpack.ProvidePlugin({
            // 项目中有$,jQuery,window.jQuery,会引入jquery模块
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        //把入口文件里面的数组打包成verdors.js
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        //这个使用uglifyJs压缩你的js代码
        new webpack.optimize.UglifyJsPlugin({ minimize: true }),
        //css单独打包
        new ExtractTextPlugin('[name]-[chunkhash:8].css'),
        //清理build文件夹
        new CleanWebpackPlugin(['build'],{
            root:ROOT_PATH
        })
    ],
    resolve: {
        modulesDirectories: ['node_modules', path.join(ROOT_PATH, 'node_modules')],
        //第一个是空字符串! 对应不需要后缀的情况.
        extensions: ['', '.js', '.jsx', '.css', '.png', '.jpg'],
        //查找module的话从这里开始查找
        root: ROOT_PATH,
        //模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            // app:path.resolve(__dirname,'app/js'),
            // 以前你可能这样引用 import { Nav } from '../../components'
            // 现在你可以这样引用 import { Nav } from 'app/components'

            // components:path.resolve(app,'components')
            // 以前你可能这样引用 @import "../../../styles/mixins.scss"
            // 现在你可以这样引用 @import "style/mixins.scss"
        }
    },
    //postcss的配置
    postcss: function() {
        return [precss, autoprefixer];
    },
}
module.exports = config;
