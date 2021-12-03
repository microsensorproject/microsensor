const fs = require("fs")
const core = require('@actions/core')
const handlebars = require('handlebars')
const github = require('@actions/github')

const templateSource = fs.readFileSync(__dirname + "/../templates/report.html", 'utf8')

async function main() {
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
