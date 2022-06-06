const fs = require("fs")
const path = require('path')
const process = require('process')
const fse = require('fs-extra')
const core = require('@actions/core')
const handlebars = require('handlebars')
const helpers = require('handlebars-helpers')();

function copyAssets(sourceDir, targetDir) {
	console.debug("Copying assets from " + sourceDir + " to " + targetDir)

	handleContentDir(targetDir)
	const sourceContent = fs.readdirSync(sourceDir);
	sourceContent.forEach(itemPath => {
		const sourceItem = path.join(sourceDir, itemPath);
		const destinyItem = path.join(targetDir, itemPath);
		fse.copySync(sourceItem, destinyItem, { overwrite: true});
	});
}

function handleContentDir(directory) {
	if (!fs.existsSync(directory)) {
		try {
			fs.mkdirSync(directory, { recursive: true });
			console.debug("New directory created.: " + directory)
		} catch (err) {
			console.debug("Problem creating directory.")
			throw err
		}
	}
}

function render(dataInput, reportOutputDir) {
	console.debug("Rendering report ...")

	handleContentDir(reportOutputDir);

	const templatesDir = path.join(__dirname, '..', 'templates');
    const templatesNames = fs.readdirSync(templatesDir);

    handlebars.registerHelper(helpers);

	console.debug("Number of report pages.: " + templatesNames.length)
    templatesNames.forEach(function (templateName) {
        const templatePath = path.join(templatesDir, templateName);
        const templateSource = fs.readFileSync(templatePath, 'utf8')
        const template = handlebars.compile(templateSource);

		const reportPage = template(dataInput)
		const reportOutputPath = path.join(reportOutputDir, templateName);

		try {
			fs.writeFileSync(reportOutputPath, reportPage, { flag: "w+" });
			console.debug("REPORT page written .: " + reportOutputPath)
		} catch (err) {
			console.debug("Problem writing the reports.")
			throw err
		}

    });
}

function main() {
    let INPUT_JSON_REPORT = core.getInput('INPUT_JSON_REPORT') || process.env.INPUT_JSON_REPORT
    let OUTPUT_HTML_REPORT_DIRECTORY = core.getInput('OUTPUT_HTML_REPORT_DIRECTORY')
        ||  process.env.OUTPUT_HTML_REPORT_DIRECTORY
        || "dist/report"

    if (typeof INPUT_JSON_REPORT !== 'string') {
        throw new Error('Invalid INPUT_JSON_REPORT: did you forget to set INPUT_JSON_REPORT?')
        // INPUT_JSON_REPORT = fs.readFileSync(__dirname + "/../data/report-sample.json", 'utf8')
    }

    let jsonReportInput = JSON.parse(INPUT_JSON_REPORT);
    console.debug(jsonReportInput)

    handlebars.registerHelper("summary", function (items) {
        const removables = [ "Bytecode Analysis", "Too Many Standards", "Wrong Cuts", "Microservice Greedy", "API Gateway" ];
        return Object.fromEntries(Object.entries(items)
            .filter(([key, value]) => !removables.includes(key)));
    })

    handlebars.registerHelper("baseUrl", function (content) {
        return  content;
    })

    const partialsDir = path.join(__dirname, '..', 'partials');
    handlebars.registerPartial('footer',  fs.readFileSync(path.join(partialsDir, "footer.html"), 'utf8'))
    handlebars.registerPartial('menubar', fs.readFileSync(path.join(partialsDir, "menubar.html"), 'utf8'))

    const distributionDir = path.join(process.env.GITHUB_WORKSPACE || path.join(__dirname, '../../../../'), OUTPUT_HTML_REPORT_DIRECTORY);

	try {
		console.debug("Start report generation ...")
		copyAssets(path.join(__dirname, '../assets'),  path.join(distributionDir, "assets"))
		render(jsonReportInput, distributionDir);
	} catch (err) {
		console.log(err.message)
	}
}


main();
