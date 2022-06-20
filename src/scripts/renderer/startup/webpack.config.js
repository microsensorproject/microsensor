const path = require('path');
const process = require('process');
const core = require('@actions/core');
const { merge } = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const singleSpaDefaults = require("webpack-config-single-spa-ts");


const ORIGIN = core.getInput('GITHUB_REPOSITORY_OWNER').concat(".github.io/").concat(core.getInput('REPOSITORY_NAME'))
	||  process.env.GITHUB_REPOSITORY_OWNER.concat(".github.io/").concat(process.env.REPOSITORY_NAME)
	|| "http://localhost:9000";

const OUTPUT_HTML_REPORT_DIRECTORY = core.getInput('OUTPUT_HTML_REPORT_DIRECTORY')
	||  process.env.OUTPUT_HTML_REPORT_DIRECTORY
	|| "dist";

const distDir = path.join(
	process.env.GITHUB_WORKSPACE || path.join(__dirname, '../../../..'),
	OUTPUT_HTML_REPORT_DIRECTORY
);

function optimize(buffer) {
	let importmap = JSON.parse(buffer.toString());
	let imports = importmap['imports'];

	Object.keys(imports).forEach(function(key, value) {
	  if (imports[key].includes('$origin')) {
		  imports[key] = imports[key].replace('$origin', ORIGIN);
	  }
	});

	importmap['imports'] = imports;
	console.log(importmap)
	return JSON.stringify(importmap, null, 2);
}

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
		      from: path.join(__dirname, '../../../..', 'data/settings/importmap.json'),
		      to: path.join(distDir, '/settings/importmap.json'),
			  transform: {
			    transformer(content) {
			      return optimize(content)
			    }
			  }
			}
		  ]
		})
    ],
	output : {
		path: distDir
	}
  });
};
