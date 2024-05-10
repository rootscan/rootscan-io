FROM node:20.13-alpine AS build

RUN apk update && apk upgrade && rm -rf /var/cache/apk/*
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --unsafe-perm

# https://pnpm.io/cli/fetch
COPY . .

RUN pnpm run build

FROM node:20.13-alpine AS deps

RUN apk update && apk upgrade && rm -rf /var/cache/apk/*
RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --prod --frozen-lockfile --no-optional --unsafe-perm

FROM node:20.13-alpine AS runner

RUN apk update && apk upgrade && apk add --no-cache tzdata && rm -rf /var/cache/apk/*

ENV NODE_ENV=production
ENV TZ=UTC

RUN addgroup  --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

WORKDIR /app

COPY --chown=nodejs:nodejs --from=build /app/build/ ./build
COPY --chown=nodejs:nodejs --from=deps /app/node_modules/ ./node_modules

RUN ls -al /app/build/libs/api/

ARG BRANCH_NAME="dev"
ARG GITHUB_SHA="dev"

ENV GITHUB_SHA=${GITHUB_SHA}

USER nodejs

#RUN for d in $(find ./dist -name assets);do \
#    echo "{\"branch\": \"$BRANCH_NAME\", \"commit\": \"${GITHUB_SHA}\" }" > $d/build.json;\
#  done

EXPOSE 4000
EXPOSE 3000
