# Block Explorer Indexer

## _Indexes everything Root related_

BEI is an indexer for the Root Network that comes with it's own REST API server.

## Features

- Extrinsics, Events, EVM Transactions
- Bridge
- Full NFT support from both SFT and NFT pallet as well as the EVM Layer.
- Contract verification through [sourcify.dev](https://sourcify.dev/)
- ✨.. and much more

## Installation

BEI was developed on [Node.js](https://nodejs.org/) v20.9.0 LTS but should be able to run on any NodeJS 16LTS and higher.

Ensure that you have all prerequisites setup in order to build the project.

| Prerequisite                        | Link                                                   | Explanation                                                                                                                     |
| ----------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| MongoDB Cluster                     | [URL](https://www.mongodb.com/)                        | It it suggested you start off with at least 40GB of storage in order to fit all the processed blockchain data.                  |
| Redis Server                        | [URL](https://redis.io/)                               | Ensure that the policy of the Redis Server is set to `noeviction`. Otherwise the tasks at the end of the queue will be evicted. |
| The Root Network RPC @ Archive Mode | [URL](https://github.com/futureversecom/trn-seed/)     | A RPC node with a high throughput is recommended and should be running in Archive Mode.                                         |
| CoinMarketCap API Key               | [URL](https://coinmarketcap.com/api/documentation/v1/) | This key is required to fetch market prices of the various tokens such as Root and XRP.                                         |

Ensure you create the correct `.env` file based on the already set up prerequisites. You can simply copy `.env.skel` and rename it to `.env`

```sh
# Database
MONGO_URI=""
# Workerpool
WORKERPOOL_QUEUE=""
# ChainId 7668 = Mainnet, 7672 = Porcini
CHAIN_ID=""
# CoinMarketCap
CMC_API_KEY=""
# RPC
RPC_WS_URL=""
RPC_HTTP_URL=""

# REDIS
REDIS_USERNAME=""
REDIS_PASSWORD=""
REDIS_HOST=""
REDIS_PORT=""

```

Install the dependencies and build the project.

```sh
pnpm i
pnpm run build
```

Before we execute any code it is important to understand what every process does. There are 3 main processes to get data to the Block Explorer.

| Process    | Explanation                                                                                                                                                                                       | Scaling                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API Server | The API server's only purpose is to provide a REST API that the Block Explorer can utilize to fetch data. If the indexer has not ran yet, there will be no data to display.                       | Can scale indefinitely behind a load balancer                                                                                                                        |
| Scheduler  | The scheduler is the orchestrator of the entire project, it continues to listen for new blocks coming in from the blockchain through the WebSocket provider. It will also create repeating tasks. | Should only run a **SINGLE** thread                                                                                                                                  |
| Worker     | A worker thread is nothing but a processor for the workerpool. The more workers you have, the faster you will be able to process the queue.                                                       | Can scale indefinitely. Please note that each worker will consume a CPU thread. So never overload the CPU by spawning more workers than it has in available threads. |

Alright, now under the assumption that a lot more is clear and we have built the project.

```sh
# To start the API
pnpm run start:api
# To start the Scheduler
pnpm run start:scheduler
# To start the Worker
pnpm run start:worker
```
