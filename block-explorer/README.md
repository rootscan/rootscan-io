# Block Explorer Frontend

## _Displays every piece of data from BEI's API_

BEF is the frontend implementation on top of BEI's API and it's goal is to give the end user full visibility over his data.

Create an .env with the following fields.

```sh
# The API server that Next will use to query data from
BASE_URL=""
# Tells us which Sourcify contract verification server we should rely on
# 7668 = Mainnet, 7672 = Porcini
CHAIN_ID=""
```

```sh
# Install all packages
pnpm i
# Run dev server
pnpm run dev
# Build & start build
pnpm run build && pnpm run start
```

That's all, folks!
