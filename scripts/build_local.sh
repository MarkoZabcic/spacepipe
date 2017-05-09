#!/bin/sh
OPTIONS="-t meteorapp $1"
SCRIPTDIR=$(dirname $0)

${SCRIPTDIR}/build-on-docker-machine.sh "${OPTIONS}"
