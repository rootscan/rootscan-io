import { Address, getAddress } from "viem";
import fs from "node:fs/promises";

export const getTokenMetadata = async (
  contractAddress: Address,
  tokenId: number,
  network: "root" | "porcini"
) => {
  const fileDir = `./src/libs/token-data/blockchains/${network}/${getAddress(
    contractAddress
  )}.json`;
  const readData = await fs.readFile(fileDir, "utf-8");
  const data = structuredClone(JSON.parse(readData));

  const metadata = data?.find((a) => Number(a?.tokenId) === Number(tokenId));

  return metadata || null;
};
