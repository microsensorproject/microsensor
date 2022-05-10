const fs = require("fs")
const path = require('path');
const core = require('@actions/core')
const handlebars = require('handlebars')
const helpers = require('handlebars-helpers')();

function render(dataInput, reportOutputDir) {
    const templatesDir = path.join(__dirname, '..', 'templates');
    const templatesNames = fs.readdirSync(templatesDir);

    handlebars.registerHelper(helpers);
    templatesNames.forEach(function (templateName) {
        const templatePath = path.join(templatesDir, templateName);
        const templateSource = fs.readFileSync(templatePath, 'utf8')
        const template = handlebars.compile(templateSource);

        const reportPage = template(dataInput)
        const reportOutputPath = path.join(reportOutputDir, templateName);
        fs.writeFile(reportOutputPath, reportPage, function (err) {
            if (err) throw err;
        });
    });
}

async function main() {
    let INPUT_JSON_REPORT = core.getInput('INPUT_JSON_REPORT') || process.env.INPUT_JSON_REPORT
    let OUTPUT_HTML_REPORT_DIRECTORY = core.getInput('OUTPUT_HTML_REPORT_DIRECTORY') ||  process.env.OUTPUT_HTML_REPORT_DIRECTORY
    if ( typeof INPUT_JSON_REPORT !== 'string' ) {
        throw new Error('Invalid INPUT_JSON_REPORT: did you forget to set INPUT_JSON_REPORT?')
        // INPUT_JSON_REPORT = fs.readFileSync(__dirname + "/../data/report-sample.json", 'utf8')
    }

    const jsonReportInput = JSON.parse(INPUT_JSON_REPORT);
    console.debug(jsonReportInput)

    const partialsDir = path.join(__dirname, '..', 'partials');
    handlebars.registerPartial('footer',  fs.readFileSync(path.join(partialsDir, "footer.html"), 'utf8'))
    handlebars.registerPartial('menubar', fs.readFileSync(path.join(partialsDir, "menubar.html"), 'utf8'))

    const distributionDir = path.join(process.env.GITHUB_WORKSPACE, OUTPUT_HTML_REPORT_DIRECTORY);
    console.debug("Generating report at.: " + distributionDir)
    render(jsonReportInput, distributionDir || path.join(__dirname, '../../../../', 'dist'));
}


main().catch(error => {
    console.error(error)
})
