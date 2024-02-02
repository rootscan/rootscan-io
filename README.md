# rootscan-io

## Requirements

* docker - to run redis and mongo
* pnpm - to install dependencies
* nodejs - to run the project

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
