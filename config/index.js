const autoConfig = require('./webpack.auto.config')
// const vueConfig = require('./webpack.vue.config')

module.exports = [
    mode: 'production', // 保持 production 模式（或由命令行控制）
    
    // 👇 加上这一段优化配置，关闭压缩
    optimization: {
        minimize: false, // 核心：关闭代码压缩，变量名和格式将保持原样
    },

    // 💡 强烈建议：顺便开启 source-map，这样在报错或调试时能精确定位到具体的源码行数
    devtool: 'source-map',
    // vueConfig,
    autoConfig
]
