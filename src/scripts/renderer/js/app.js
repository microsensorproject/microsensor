const fs = require("fs")
const core = require('@actions/core')
const handlebars = require('handlebars')
const github = require('@actions/github')

const templateSource = fs.readFileSync(__dirname + "/../templates/report.html", 'utf8')

async function main() {

    const INPUT_JSON_REPORT = core.getInput('INPUT_JSON_REPORT') || process.env.INPUT_JSON_REPORT
    if ( typeof INPUT_JSON_REPORT !== 'string' ) {
        throw new Error('Invalid INPUT_JSON_REPORT: did you forget to set INPUT_JSON_REPORT?')
    }

    console.log(INPUT_JSON_REPORT)

    // const jsonReportInput = JSON.parse(core.getInput("json_report"));
    // console.log(jsonReportInput)

    const template = handlebars.compile(templateSource);
    const data = { "title": "MSA Nose Report" };
    const report = template(data)
    console.log(report)
    core.setOutput("html_report", report)
}



main().catch(error => {
    console.error(error)
})
