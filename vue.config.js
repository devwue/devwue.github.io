module.exports = {
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    },
    publicPath: '/',
    outputDir: 'docs',
    devServer: {
        port: process.env.VUE_APP_PORT || 8080
    },
    pluginOptions: {
        sitemap: {
            urls: [
                'https://devwue.github.io/home',
                'https://devwue.github.io/about',
            ]
        }
    }
}