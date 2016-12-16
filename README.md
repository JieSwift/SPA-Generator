# React Webpack构建SPA脚手架 #

>接触了一段时间React,想用React做一个SPA（Single Page Application）单页应用,决定用Webpack+React实现。通过查询一些资料和一些大神的文章，算是了解Webpack,决定写一个脚手架,方便以后写项目。笔者是学生,技术比较有限,写的不对的地方,请大家指正。

## 安装包依赖 ##
    npm install && bower install

## 开始项目 ##
> 开启服务,运行。

    npm start

## 生产模式构建文件 ##
    npm run deploy -->linux
    npm run deploy-windows -->windows

## eslint代码检查 ##
    npm run eslint

## Webpack详细配置 ##

### 安装Webpack ###
    npm install --save-dev webpack

### 分类 ###
> webpack.config.js 开发环境下的Webpack配置
> webpack.production.config.js 生产环境下的配置

### 一些文件路径 ###
    //定义了一些文件夹路径
    var ROOT_PATH = path.resolve(__dirname);
    var SRC_PATH = path.resolve(ROOT_PATH, 'src');
    var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
    //Template的文件夹路径
    var TEM_PATH = path.resolve(SRC_PATH, 'template');

### 配置webpack-dev-server ###
> 让你的浏览器监测你都代码的修改，并自动刷新修改后的结果，其实Webpack提供一个可选的本地开发服务器，这个本地服务器基于node.js构建，可以实现你想要的这些功能，不过它是一个单独的组件，在webpack中进行配置之前需要单独安装它作为项目依赖

    npm install --save-dev webpack-dev-server

> 现在每次修改一个component的代码，页面都会重新刷新，这会造成一个很不爽的问题，程序会丢失状态，当然现在在简单的程序中这个完全无所谓，但是假如程序变得越来越复杂，想要返回这种状态你可能又要经历一系列的点击等操作，会耗费一些时间。
>  Babel-plugin-react-transform 可以实时的对你的React Component做各种处理，它是基于Babel Plugin。

    npm install --save-dev babel-plugin-react-transform

> 这是个基本的架子，可以通过它完成各种transform，如果想实现Hot Module Replacement (说白了就是页面不刷新，直接替换修改的Component)，再安装一个transform.

    npm install --save-dev react-transform-hmr

> 如果我们还要再来一个在页面上直接显示catch到的错误的transform，（不想打开console看到底有啥错误，直接显示在页面上多好），简单！再安装一个transform:

    npm install --save-dev react-transform-catch-errors redbox-react

> 依赖安装完毕，配置Babel，上面说到把Babel的配置都写在webpack.config.js中，这是一个不好的方法，因为随着Babel的config越来越多，那样会显得非常臃肿，把babel的配置分离出来。
>  .babelrc文件配置

    {
      "presets": [ "es2015", "stage-0", "react"],
    
      /* if you want to use babel runtime, uncomment the following line */
      // "plugins": ["transform-runtime"],
      //在开发的时候才启用HMR和Catch Error
      "env": {
        "build": {
          "optional": ["optimisation", "minification"]
        },
        "development": {
         "presets": ["react-hmre"]
        }
      }
    }

> 要让新建的两个transform生效,只需再安装一个present。

    npm install babel-preset-react-hmre --save-dev

### entry入口配置 ###
    //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
    entry: {
        //这里配置了两个入口
        index: path.resolve(SRC_PATH, 'index.jsx'),
        admin: path.resolve(SRC_PATH, 'admin.jsx'),
        //第三方库
        vendors: ['react', 'react-dom', 'react-router']
    },
    plugins: [
        //把入口文件里面的数组打包成verdors.js
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    ]

### output配置 ###
     //输出的文件名 合并以后的文件名
    output: {
        path: BUILD_PATH,
        publicPath: '/',
        //生成Hash名称的文件名来防止缓存
        filename: '[name]-[chunkhash:8].js'
    },

### module ###
> 先安装需要的模块

> 我们写的代码是ES6语法规则所以需要Babel，Babel其实是一个编译JavaScript的平台，它的强大之处表现在可以通过编译帮你达到以下目的：
> - 下一代的JavaScript标准（ES6，ES7），这些标准目前并未被当前的浏览器完全的支持；
> - 使用基于JavaScript进行了拓展的语言，比如React的JSX
     
    npm install --save-dev babel-loader babel-preset-es2015 babel-preset-react

> 安装处理css文件loader

    npm install --save-dev  css-loader style-loader postcss-loader

> 处理图片

    npm install --save-dev file-loader url-loader

> 使用不同的loader，webpack通过调用外部的脚本或工具可以对各种各样的格式的文件进行处理，比如说分析JSON文件并把它转换为JavaScript文件，或者说把下一代的JS文件（ES6，ES7)转换为现代浏览器可以识别的JS文件。或者说对React的开发而言，合适的Loaders可以把React的JSX文件转换为JS文件。

>Loaders需要单独安装并且需要在webpack.config.js下的modules关键字下进行配置，Loaders的配置选项包括以下几方面：
- test：一个匹配loaders所处理的文件的拓展名的正则表达式（必须）
- loader：loader的名称（必须）
- include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）；
- query：为loaders提供额外的设置选项（可选）

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

### plugin配置 ###
> 安装需要插件

    npm install --save-dev html-webpack-plugin extract-text-webpack-plugin clean-webpack-plugin
- html-webpack-plugin 根据模板生成HTMl文件插件
- extract-text-webpack-plugin css单独打包插件
- clean-webpack-plugin 清理文件夹插件，build文件清理以前的文件

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

### resolve 配置 ###
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

### 查看项目整体信息 ###
> 生成一个json文件

    webpack --json > stats.json

> 把json文件上传到 WEBPACK VISUALIZER 或者 webpack analyse
[webpack analyse](http://webpack.github.io/analyse/ "webpack analyse")
[WEBPACK VISUALIZER](http://chrisbateman.github.io/webpack-visualizer/ "WEBPACK VISUALIZER")

## 参考文章 ##
[JavaScript 全栈工程师培训教程](http://www.ruanyifeng.com/blog/2016/11/javascript.html "ruanyifeng")
[Webpack傻瓜式指南](https://zhuanlan.zhihu.com/p/20367175?refer=FrontendMagazine "zhuanlan.zhihu.com")
[入门Webpack，看这篇就够了](http://blog.csdn.net/kun5706947/article/details/52596766 " 入门Webpack，看这篇就够了")