#!/usr/bin/env bash

java -jar /usr/local/msa-nose/msa-nose-0.0.1.jar > /var/log/msanose.log 2>&1 &
RESPONSE_STATUS=$(curl --output /dev/null --write-out %{http_code} --insecure --silent -X POST http://127.0.0.1:8080/api/v1/ -H 'Content-Type: application/json')

while [ ! "$RESPONSE_STATUS" -eq 200 ]
do
  RESPONSE_STATUS=$(curl --output /dev/null --write-out %{http_code} --insecure --silent -X POST http://127.0.0.1:8080/api/v1/ -H 'Content-Type: application/json')
  echo "$RESPONSE_STATUS"
  sleep 1
done
