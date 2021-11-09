#!/usr/bin/env bash

TARGET_DIRECTORY="${1:-"/home/runner/work/_temp/_github_workflow"}"
REQUEST_JSON_PAYLOAD="{ \"pathToCompiledMicroservices\": \"$TARGET_DIRECTORY\", \"organizationPath\": \"\", \"outputPath\": \"\" }"

source /usr/local/msa-nose/msanose.sh > /dev/null
REPORT=$(curl -X POST http://127.0.0.1:8080/api/v1/report -H 'Content-Type: application/json' -d "$REQUEST_JSON_PAYLOAD")

echo "::set-output name=report::$REPORT"
