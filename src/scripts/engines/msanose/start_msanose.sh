#!/usr/bin/env bash

#===  FUNCTION  ================================================================
#          NAME: health_check_msanose_service
#   DESCRIPTION: It checks if the MSANose Service is ready to receive requests
#   (i.e., health) through Http Status Code.
#
#    PARAMETERS:
#       RETURNS: The Http Status code of the MSANose service request.
#===============================================================================
health_check_msanose_service() {
  local RESULT
  RESULT=$(
    curl --output /dev/null \
         --write-out %{http_code} \
         --insecure \
         --silent -X POST http://127.0.0.1:8080/api/v1/ -H 'Content-Type: application/json')

  echo "$RESULT"
}

#===  FUNCTION  ================================================================
#          NAME: start_msanose_service
#   DESCRIPTION: It starts MSANose application.
#    PARAMETERS:
#       RETURNS:
#===============================================================================
start_msanose_service() {
  java -jar /usr/local/msa-nose/msa-nose-0.0.1.jar > /var/log/msanose.log 2>&1 &
}

#===  FUNCTION  ================================================================
#   NAME: wait_msanose_service_get_ready
#   DESCRIPTION: It holds the execution flow by the time MSANose service's ready
#   to receive requests.
#
#    PARAMETERS:
#       RETURNS:
#===============================================================================
wait_msanose_service_get_ready() {
  local RESPONSE_STATUS=0
  while [ ! "$RESPONSE_STATUS" -eq 200 ]
  do
    RESPONSE_STATUS=$(health_check_msanose_service)
    if [ ! "$RESPONSE_STATUS" -eq 200 ]; then
      echo "."
      sleep 1
    fi
    echo " OK"
  done
}




main() {
  start_msanose_service
  wait_msanose_service_get_ready
}

main
