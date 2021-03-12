#
# Build stage
#
FROM node:12.20.1-alpine3.11 AS build
WORKDIR /

# Update the package indices and upgrade any system packages.
RUN apk update
RUN apk upgrade

# Install build dependencies.
RUN apk --no-cache add --virtual build-deps build-base python && PYTHON=/usr/bin/python

RUN npm i -g lerna

# Make a dist folder to hold just the service we're imaging.
RUN mkdir -p /dist/packages

WORKDIR /dist

# Create a cache folder to pull in everything.
RUN mkdir /cache
WORKDIR /cache

# Copy over build process code.
# COPY scripts scripts

COPY lerna.json lerna.json

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci

COPY packages packages

# This line will cause everything from here on to cache separately for each service.
ARG SERVICE_PACKAGE_NAME

RUN mv packages/${SERVICE_PACKAGE_NAME} /dist/packages/${SERVICE_PACKAGE_NAME}

WORKDIR /dist

COPY lerna.json lerna.json

COPY package.json package.json
COPY package-lock.json package-lock.json

# Install production dependencies for the package we're imaging
RUN lerna bootstrap --hoist --ci -- --production

#
# Dist stage
#
FROM node:12.20.1-alpine AS dist
WORKDIR /dist

COPY --from=build dist .

# Pull in the service package path and set the workdir so our start command executes
# in the correct directory.
ARG SERVICE_PACKAGE_NAME

WORKDIR /dist/packages/${SERVICE_PACKAGE_NAME}

CMD ["npm", "run", "start"]