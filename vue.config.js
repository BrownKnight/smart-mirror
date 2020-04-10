module.exports = {
    devServer: {
        host: "localhost",
        hot: true,
        port: 8080,
        proxy: {
            '^/api': {
              target: 'http://localhost:3000/',
              changeOrigin: true
            },
            '^/foo': {
              target: 'google.com'
            }
        }
    },
    pluginOptions: {
        express: {
            shouldServeApp: true,
            serverDir: "./server"
        }
    }
};
