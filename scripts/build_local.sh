#!/bin/sh
OPTIONS="-t ${npm_package_name} $1"
SCRIPTDIR=$(dirname $0)
echo "Options: ${OPTIONS}"

${SCRIPTDIR}/build-on-docker-machine.sh "${OPTIONS}"
