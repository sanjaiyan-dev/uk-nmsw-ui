#!/bin/bash

ENV=${ENV}
SECRETSDIR="./helm/secrets"
OUTPUTDIR="./helm/templates/secrets"

if [[ -z ${ENV} ]]; then
  if [[ -z $1 ]]; then
    echo "ERROR: Received no arguments for \"\$ENV\"."
    exit 1
  fi
  export ENV=$1
  echo "\"\$ENV\" is ${ENV}."
fi

apk add --update --no-cache gnupg findutils
mkdir ./helm/templates/secrets

for file in $(find ${SECRETSDIR} -iname "*nmsw*${ENV}*asc" -printf "%f\n"); do
  echo "Current file: \"${file}\"."
  FILENAME=$(echo ${file} | sed 's/.asc//g')
  echo "Attempting decryption."
  gpg --output ${OUTPUTDIR}/${FILENAME} --batch --passphrase ${GPG_KEY} -d ${SECRETSDIR}/${file}
done
