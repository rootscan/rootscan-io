![image (9)](https://github.com/rootscan/rootscan-io/assets/23193015/42011581-be3d-43f6-bce7-457a3e09db59)

![GitHub CI](https://github.com/rootscan/rootscan-io/actions/workflows/build.yml/badge.svg)

# Rootscan

This repo uses [package-based](https://nx.dev/getting-started/tutorials/package-based-repo-tutorial) nx structure
Each folder is separate project.

## Requirements

- docker - to run redis and mongo
- pnpm - to install dependencies
- nodejs - to run the project

### Optional

- [snyk](https://docs.snyk.io/snyk-cli/install-or-update-the-snyk-cli) - security checks

## Getting Started

### Setup

Install dependencies and start docker

```shell
pnpm run setup
```

### Variables

Copy the `.env.example` file to `.env`, by default example designed to run against porcini

### Run API

The API used by web `block-explorer`

```shell
pnpm run api
```

### Run Web

```shell
pnpm run block-explorer
```

### Run Processors

Run worker to process jobs

```shell
pnpm run worker
```

To schedule jobs

```shell
pnpm run scheduler
```

Bull board can be used to see jobs scheduled and run

```shell
pnpm run bull-board
```
