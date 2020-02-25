var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devServer: {
		historyApiFallback: true,
		hot: true // This will make the server understand "/some-link" routs instead of "/#/some-link"
	},
	entry: [
		'babel-polyfill',
		'webpack-dev-server/client?http://127.0.0.1:8080/', // Specify the local server port
		'webpack/hot/only-dev-server', // Enable hot reloading
		'./src/scripts', // This is where Webpack will be looking for the entry index.js file
		'./src/styles/main.less'
		// "font-awesome-webpack"
	],
	output: {
		path: path.join(__dirname, 'build'), // This is used to specify folder for producion bundle
		filename: 'bundle.js', // Filename for production bundle
		publicPath: '/'
	},
	resolve: {
		modules: [
			'node_modules',
			'src',
			path.resolve(__dirname, 'src/scripts'),
			path.resolve(__dirname, 'node_modules')
		], // Folders where Webpack is going to look for files to bundle together
		extensions: ['.jsx', '.js'] // Extensions that Webpack is going to expect
	},
	module: {
		// Loaders allow you to preprocess files as you require() or “load” them. 
		// Loaders are kind of like “tasks” in other build tools, and provide a powerful way to handle frontend build steps.
		loaders: [
			// the url-loader uses DataUrls.
			// the file-loader emits files.
			{
				test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
				loader: 'url-loader',
				options: {
					limit: 8192
				}
			},
			{
				test: /\.jsx?$/, // Here we're going to use JS for react components but including JSX in case this extension is preferable
				include: [
					path.resolve(__dirname, "src"),
				],
				loader: 'react-hot-loader'
			},
			{
				loader: "babel-loader",

				// Skip any files outside of your project's `src` directory
				include: [
					path.resolve(__dirname, "src"),
				],

				// Only run `.js` and `.jsx` files through Babel
				test: /\.jsx?$/,

				// Options to configure babel with
				query: {
					plugins: ['transform-runtime'],
					presets: ['es2015', 'stage-0', 'react'],
				}
			},
			{
				test: /\.less$/,
				use: [{
						loader: "style-loader"
					},
					{
						loader: "css-loader"
					},
					{
						loader: "less-loader"
					}
				]
			}
		]
	},
	resolveLoader: {
		moduleExtensions: ['-loader']
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(), // Hot reloading
		new webpack.NoEmitOnErrorsPlugin(), // Webpack will let you know if there are any errors

		// Declare global variables
		new webpack.ProvidePlugin({
			React: 'react',
			ReactDOM: 'react-dom',
			_: 'lodash'
		}),

		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
			hash: false,
			jQuery: 'jquery',
		}),
	]
}