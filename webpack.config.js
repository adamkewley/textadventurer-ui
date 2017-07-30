var path = require("path");

module.exports = {
    entry: {
	main: "./src/textadventurer.js"
    },

    output: {
	filename: "textadventurer.js",
	path: path.resolve(__dirname, "dist")
    },

    devtool: "source-map",

    devServer: {
	port: (process.env.PORT || 8090),
	proxy: {
	    "/api": {
		target: "http://localhost:8080",
		secure: false,
		ws: true,
		pathRewrite: {
		    "^/api": ""
		}
	    }
	}
    }
};
