#!/bin/sh

if [ ! -n "$1" ]; then
	echo "Received empty environment argument"
	exit 1
fi	

ENV=$1

echo "Running npm install"
npm ci && npm cache clean --force

echo "Starting webserver"
npm start >/dev/null 2>&1 &

echo "Waiting 15s before starting Cypress tests"
sleep 15
npm cypress:run:$ENV
RC=$?

echo "Stopping webserver"
ps -ef | grep webpack | awk '{ print $2 }' | xargs -i kill -9 {} 2>/dev/null
exit $RC
