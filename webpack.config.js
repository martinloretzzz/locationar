const path = require("path");
const PrettierPlugin = require("prettier-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
	entry: "./src/LOCATIONAR.ts",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	devServer: {
		contentBase: __dirname,
		compress: true,
		port: 8080,
		host: "0.0.0.0",
		https: true
	},
	devtool: "source-map",
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	output: {
		library: "LOCATIONAR",
		libraryTarget: "umd",
		filename: "LOCATIONAR.js",
		path: __dirname + "/dist"
	},
	externals: {
		three: "THREE"
	},
	plugins: [new PrettierPlugin(), new BundleAnalyzerPlugin()] //
};
