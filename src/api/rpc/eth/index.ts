import { Blockchain } from "@ethereumjs/blockchain";
import { convertToBigInt, flattenObject } from "../../../utils";

export async function eth_getBlockByNumber(
  blockchain: Blockchain,
  { blockNumber }: { blockNumber: string }
) {
  return flattenObject(
    (await blockchain.getBlock(convertToBigInt(blockNumber))).toJSON()
  );
}
export async function eth_getBlockByHash(blockchain: Blockchain, hash: Buffer) {
  return await blockchain.getBlock(hash);
}
