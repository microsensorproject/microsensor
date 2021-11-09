#!/usr/bin/env bash

source /usr/local/msa-nose/start_msanose.sh > /dev/null

TARGET_DIRECTORY="${1:-"/home/runner/work/_temp/_github_workflow"}"
REQUEST_JSON_PAYLOAD="{ \"pathToCompiledMicroservices\": \"$TARGET_DIRECTORY\", \"organizationPath\": \"\", \"outputPath\": \"\" }"

REPORT=$(curl -X POST http://127.0.0.1:8080/api/v1/report -H 'Content-Type: application/json' -d "$REQUEST_JSON_PAYLOAD")
echo "::set-output name=report::$REPORT"
