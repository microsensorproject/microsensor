#!/usr/bin/env bash

TARGET_DIRECTORY="${1:-"/home/runner/work/_temp/_github_workflow"}"
REQUEST_JSON_PAYLOAD="{ \"pathToCompiledMicroservices\": \"$TARGET_DIRECTORY\", \"organizationPath\": \"\", \"outputPath\": \"\" }"

echo "$REQUEST_JSON_PAYLOAD"
