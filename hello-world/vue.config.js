module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/pwa2app/' : '/',
    outputDir: '../docs',
    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0'
    },
    lintOnSave: false
}