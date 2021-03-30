module.exports = {
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/docs',
    outputDir: 'docs'
}