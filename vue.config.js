module.exports = {
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    },
    publicPath: '/',
    outputDir: 'docs',
    devServer: {
        port: process.env.VUE_APP_PORT || 8080
    }
}