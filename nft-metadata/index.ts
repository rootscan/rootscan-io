import { program } from "commander";
import { getAddress, isAddress } from "viem";

program.option("--network"); // 0
program.option("--contractaddress"); // 1
program.option("--type"); // 2

program.parse();

const options = program.opts();

if (!options?.network || !options?.contractaddress || !options?.type) {
  console.error(`Missing one of the required arguments.`);
  // @ts-expect-error
  process.exit(1);
}

const network = program.args[0];
if (network !== "porcini" && network !== "root") {
  console.error(`Network can only be root or porcini`);
  // @ts-expect-error
  process.exit(1);
}
let contractAddress = program?.args?.[1];
if (!isAddress(contractAddress)) {
  console.error(`Provided contractAddress is an invalid address`);
  // @ts-expect-error
  process.exit(1);
} else {
  contractAddress = getAddress(program?.args?.[1]);
}
const tokenType = program?.args?.[2]?.toLowerCase();

console.log({ network, contractAddress, tokenType });
