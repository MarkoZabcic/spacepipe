#!/bin/sh

if [ "$#" -eq 0 ]; then
    echo Usage: $0 dockertags
    exit
fi

echo "[meteor-alpine] Docker Build Step Tags: $1"
CONTAINER="$(cat /proc/1/cgroup | grep 'docker/' | tail -1 | sed 's/^.*\///' | cut -c 1-12)"
BUILDDIR=/dockerhost
OPTIONS="$1"

echo "[meteor-alpine] Docker Build Step 1/3: Generate Alpine Build Image if not exists"
echo "[meteor-alpine] Run: docker build ${BUILDDIR}/build-alpine -t alpinebuild"
docker build ${BUILDDIR}/build-alpine -t meteor-alpine-npm-rebuild
echo "[meteor-alpine] Docker Build Step 2/3: Run Alpine Build Image on ${CONTAINER} to rebuild npm packages for alpine"
echo "[meteor-alpine] Run: docker run --volumes-from ${CONTAINER} --rm alpinebuild"
docker run --volumes-from ${CONTAINER} --rm meteor-alpine-npm-rebuild
echo "[meteor-alpine] Docker Build Step 3/3: Generate Final Ad-hoc alpine based Image of the Meteor App"
echo "[meteor-alpine] Run: docker build $1 ${BUILDDIR}/bundle-alpine"
docker build ${OPTIONS} ${BUILDDIR}/bundle-alpine
