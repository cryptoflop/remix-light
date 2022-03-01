import { Provider, extend } from '@remix-project/remix-simulator';
import { BN } from 'ethereumjs-util';

import Web3Type from 'web3';
// ugly web3 🤮
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');


export const EMPTY = '0x';

const chain = new Provider({ fork: 'london' });

let web3: Web3Type & { eth: (typeof Web3Type.prototype.eth) & {
  getHashFromTagBySimulator: (tag: number) => Promise<string>,
  getExecutionResultFromSimulator: (hash: string) => Promise<{
    returnValue: Buffer,
    gas: BN,
    gasUsed: BN,
    gasRefund: BN,
    gasPrice: BN,
    exceptionError: string
  }>
} };
export function web3Instance() {
  return web3;
}

export async function init() {
  await chain.init();
  web3 = new Web3(chain);
  extend(web3);
}

export async function sendTx(args: {
  from: string, to: string, data?: string, value?: BN, timestamp?: number, gasLimit?: string
}) {
  return await web3.eth.sendTransaction({
    data: EMPTY,
    gasLimit: '0x2dc6c0',
    timestamp: Date.now(),
    // value: '0',
    ...args
  });
}
