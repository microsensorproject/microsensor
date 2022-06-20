const path = require('path');
const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const core = require('@actions/core');
const process = require("process");


const OUTPUT_HTML_REPORT_DIRECTORY = core.getInput('OUTPUT_HTML_REPORT_DIRECTORY')
	||  process.env.OUTPUT_HTML_REPORT_DIRECTORY
	|| "dist";

const distDir = path.join(
	process.env.GITHUB_WORKSPACE || path.join(__dirname, '../../../..'),
	OUTPUT_HTML_REPORT_DIRECTORY
);

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "microsensor",
    projectName: "nav",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
	output : {
	  path: path.join(distDir, 'assets/nav')
	}
  });
};
