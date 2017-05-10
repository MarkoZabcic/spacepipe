#!/bin/sh
if [ -z ${npm_package_version+x} ]; then
  OPTIONS="-t ${npm_package_name} $1"
else
  OPTIONS="-t ${npm_package_name}:${npm_package_version} -t ${npm_package_name}:latest $1"
fi
echo "Options: ${OPTIONS}"

# build docker Image
CONTAINER_ID=$(docker create -v /dockerhost -v /var/run/docker.sock:/var/run/docker.sock docker /dockerhost/build-on-remote-host.sh "${OPTIONS}")
docker cp .build/build-alpine ${CONTAINER_ID}:/dockerhost
docker cp .build/bundle ${CONTAINER_ID}:/dockerhost
docker cp .build/bundle-alpine ${CONTAINER_ID}:/dockerhost
docker cp .build/build-on-remote-host.sh ${CONTAINER_ID}:/dockerhost
docker start -a ${CONTAINER_ID}
docker rm -f -v ${CONTAINER_ID}
