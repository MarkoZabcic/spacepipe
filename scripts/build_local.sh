#!/bin/sh
if [ -z ${npm_package_version+x} ]; then
  OPTIONS="-t ${npm_package_name} $1"
else
  OPTIONS="-t ${npm_package_name}:${npm_package_version} -t ${npm_package_name}:latest $1"
fi

SCRIPTDIR=$(dirname $0)
echo "Options: ${OPTIONS}"

${SCRIPTDIR}/build-on-docker-machine.sh "${OPTIONS}"
