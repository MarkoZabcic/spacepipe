FROM debian:jessie

RUN apt-get -qq update; \
  apt-get install -y \
  ca-certificates \
	curl \
	openssl \
  procps \
  python \
  git \
  g++  \
  make \
  bzip2 \
  locales

RUN locale-gen en_US.UTF-8
RUN localedef -i en_GB -f UTF-8 en_US.UTF-8
RUN export LC_ALL=en_US

ENV DOCKER_BUCKET get.docker.com
ENV DOCKER_VERSION 17.03.1-ce
ENV METEOR_ALLOW_SUPERUSER 1
ENV DEBIAN_FRONTEND noninteractive

RUN curl -fSL "https://${DOCKER_BUCKET}/builds/Linux/x86_64/docker-${DOCKER_VERSION}.tgz" -o docker.tgz; \
  tar -xzvf docker.tgz; \
  mv docker/* /usr/local/bin/; \
  rmdir docker; \
  rm docker.tgz; \
  docker -v

RUN curl https://install.meteor.com/ | sh
RUN useradd docker --shell /bin/bash --create-home
USER docker
