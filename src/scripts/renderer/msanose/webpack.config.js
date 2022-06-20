const path = require("path");
const process = require("process");
const core = require('@actions/core');
const { merge } = require("webpack-merge");
const GenerateJsonFile = require('generate-json-file-webpack-plugin');
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");


const INPUT_JSON_REPORT = process.env.MSANOSE_JSON_REPORT || require(path.join(__dirname, 'data/report-sample.json'))

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
    projectName: "msanose",
    webpackConfigEnv,
    argv,
  });

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
	plugins : [
		new GenerateJsonFile({
			filename: 'data/report.json',
			value: () => {
				const report = JSON.stringify(INPUT_JSON_REPORT);
				return JSON.parse(report);
			}
		})
	],
	output : {
	  path: path.join(distDir, 'assets/msanose')
	}
  });
};
