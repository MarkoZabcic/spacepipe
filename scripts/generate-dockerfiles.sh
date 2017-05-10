#!/bin/sh
INFO="[meteor-alpine]"
BUILDDIR=.build
SCRIPTDIR=$(dirname $0)
PROJECTSPACEPIPEDIR=.spacepipe
USERID=`id -u`
USERNAME="meteor"
USERHOME="/home/$USERNAME"
ADDUSER_COMMAND="adduser -D -u $USERID -h $USERHOME $USERNAME"  # Alpine
USERADD_COMMAND="useradd --uid $USERID -m $USERNAME"  # Debian
SUDO="sudo -u $USERNAME"
CPSUDO=${SUDO}
if [ ${USERID} -eq 0 ]; then
  # uid==0 is root, don't try to pass uid to adduser/useradd
  echo ${INFO} Building as 'root'
  ADDUSER_COMMAND="adduser -D -h $USERHOME $USERNAME"  # Alpine
  USERADD_COMMAND="useradd -m $USERNAME"  # Debian
  CPSUDO=""  # Copy the files back as root
fi
NODE_VERSION=`sed 's/v//g' ${BUILDDIR}/bundle/.node_version.txt`


if [ ! -d "$PROJECTSPACEPIPEDIR" ]; then
  mkdir $PROJECTSPACEPIPEDIR
fi

echo ${INFO} Writing Alpine build script
rm -Rf ${BUILDDIR}/build-alpine
mkdir ${BUILDDIR}/build-alpine
cat >${PROJECTSPACEPIPEDIR}/rebuild.sh <<EOM
#!/bin/sh
echo [rebuild-npm-modules-on-target] Copying project into build container
cp -r /dockerhost/bundle ${USERHOME}/bundle-alpine
chown -R ${USERNAME} ${USERHOME}/bundle-alpine
echo [rebuild-npm-modules-on-target] Installing NPM build dependencies
cd ${USERHOME}/bundle-alpine/programs/server
${SUDO} npm install
echo [rebuild-npm-modules-on-target] Copying bundle to temp directory from inside of the build container
${CPSUDO} cp -r ${USERHOME}/bundle-alpine /dockerhost/bundle-alpine/bundle
echo [rebuild-npm-modules-on-target] Alpine build container finished
EOM
cp ${PROJECTSPACEPIPEDIR}/rebuild.sh $BUILDDIR/build-alpine/alpinebuild.sh


echo ${INFO} Writing Alpine build Dockerfile
cat >${PROJECTSPACEPIPEDIR}/Dockerfile-rebuild <<EOM
# Dockerfile
FROM mhart/alpine-node:${NODE_VERSION}
RUN apk add --no-cache make gcc g++ python sudo
RUN ${ADDUSER_COMMAND}
ADD ./alpinebuild.sh alpinebuild.sh
RUN chmod +x /alpinebuild.sh
VOLUME /dockerhost
CMD /alpinebuild.sh
EOM
cp ${PROJECTSPACEPIPEDIR}/Dockerfile-rebuild ${BUILDDIR}/build-alpine/Dockerfile

echo ${INFO} Writing Alpine bundle Dockerfile
rm -Rf ${BUILDDIR}/bundle-alpine
mkdir ${BUILDDIR}/bundle-alpine
chmod 777 ${BUILDDIR}/bundle-alpine
cat >${PROJECTSPACEPIPEDIR}/Dockerfile-runtime <<EOM
# Dockerfile
FROM mhart/alpine-node:${NODE_VERSION}
RUN ${ADDUSER_COMMAND}
ADD ./bundle ${USERHOME}/bundle
WORKDIR ${USERHOME}/bundle
ENV PORT 3000
EXPOSE 3000
ENV NODE_ENV production
USER ${USERNAME}
CMD node --max_old_space_size=1024 main.js
EOM
cp ${PROJECTSPACEPIPEDIR}/Dockerfile-runtime ${BUILDDIR}/bundle-alpine/Dockerfile

echo ${INFO} Writing Sibling Script
rm -Rf ${BUILDDIR}/build-on-remote-host.sh
cp ${SCRIPTDIR}/build-on-remote-host.sh ${BUILDDIR}/build-on-remote-host.sh
