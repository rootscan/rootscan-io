FROM node:20.14-alpine AS build

RUN apk update && apk upgrade && apk add python3 make g++ --no-cache && rm -rf /var/cache/apk/*
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN ls -al .
RUN pnpm install --frozen-lockfile --unsafe-perm --force

COPY . .
RUN BASE_URL='http://api' pnpm run build

FROM node:20.14-alpine AS deps

RUN apk update && apk upgrade && apk add python3 make g++ --no-cache && rm -rf /var/cache/apk/*
RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile --no-optional --force


FROM node:20.14-alpine AS runner

RUN apk update && apk upgrade && rm -rf /var/cache/apk/*
RUN addgroup  --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

WORKDIR /app

COPY --chown=nodejs:nodejs --from=build /app/app/ ./app/
COPY --chown=nodejs:nodejs --from=build /app/public/ ./public/
COPY --chown=nodejs:nodejs --from=build /app/.next/ ./.next/
COPY --chown=nodejs:nodejs --from=build /app/package.json ./package.json
COPY --chown=nodejs:nodejs --from=build /app/next.config.js ./next.config.js
COPY --chown=nodejs:nodejs --from=deps /app/node_modules ./node_modules

RUN ls -al /app

ARG BRANCH_NAME="dev"
ARG GITHUB_SHA="dev"

ENV GITHUB_SHA=${GITHUB_SHA}

USER nodejs

EXPOSE 3000
