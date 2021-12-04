const fs = require("fs")
const core = require('@actions/core')
const handlebars = require('handlebars')

const templateSource = fs.readFileSync(__dirname + "/../templates/report.html", 'utf8')

async function main() {
    let INPUT_JSON_REPORT = core.getInput('INPUT_JSON_REPORT') || process.env.INPUT_JSON_REPORT
    if ( typeof INPUT_JSON_REPORT !== 'string' ) {
        throw new Error('Invalid INPUT_JSON_REPORT: did you forget to set INPUT_JSON_REPORT?')
        // INPUT_JSON_REPORT = fs.readFileSync(__dirname + "/../data/report-sample.json", 'utf8')
    }

    const jsonReportInput = JSON.parse(INPUT_JSON_REPORT);
    // console.log(INPUT_JSON_REPORT)

    const template = handlebars.compile(templateSource);
    const report = template(jsonReportInput)
    // console.log(report)

    fs.writeFile(__dirname + "/../../../../dist/index.html", report, function (err) {
        if (err) throw err;
    });

    core.setOutput("html_report", report)
}



main().catch(error => {
    console.error(error)
})
