const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
    devServer: {
        host: "localhost",
        hot: true,
        port: 8080,
        proxy: {
            "^/api": {
                target: "http://localhost:3000/",
                changeOrigin: true
            }
        }
    },
    pluginOptions: {
        express: {
            shouldServeApp: true,
            serverDir: "./server"
        }
    },
    configureWebpack: config => {
        // get a reference to the existing ForkTsCheckerWebpackPlugin
        const existingForkTsChecker = config.plugins.filter(p => p instanceof ForkTsCheckerWebpackPlugin)[0];

        // remove the existing ForkTsCheckerWebpackPlugin
        // so that we can replace it with our modified version
        config.plugins = config.plugins.filter(p => !(p instanceof ForkTsCheckerWebpackPlugin));

        // copy the options from the original ForkTsCheckerWebpackPlugin
        // instance and add the memoryLimit property
        const forkTsCheckerOptions = existingForkTsChecker.options;
        forkTsCheckerOptions.memoryLimit = 8192;
        forkTsCheckerOptions.tslint = true;
        console.log(forkTsCheckerOptions);

        config.plugins.push(new ForkTsCheckerWebpackPlugin(forkTsCheckerOptions));
    },
};
