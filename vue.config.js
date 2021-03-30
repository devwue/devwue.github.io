module.exports = {
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    },
    outputDir: 'docs'
}