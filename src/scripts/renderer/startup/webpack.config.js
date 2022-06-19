const path = require('path');
const { merge } = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "microsensor";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
        },
      }),
		new CopyPlugin({
			patterns: [
				{
					from: path.join(__dirname, '../../../..', 'data'),
					to: path.join(__dirname, '../../../..', 'dist')
				},
			],
		}),

    ],
	output : {
		path: path.join(__dirname, '../../../..', 'dist')
	}
  });
};
