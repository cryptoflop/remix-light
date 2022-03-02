import { Provider, extend } from '@remix-project/remix-simulator';
import { BN } from 'ethereumjs-util';

import type Web3Type from 'web3';
// ugly web3 🤮
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

type Web3Extended = Web3Type & { eth: (typeof Web3Type.prototype.eth) & {
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

export const EMPTY = '0x';

export class Chain {

  public web3: Web3Extended;

  public static async spinup() {
    const chain = new Provider({ fork: 'london' });
    await chain.init();
    const web3 = new Web3(chain);
    extend(web3);
    return new Chain(web3);
  }

  constructor(web3Instance: Web3Extended) {
    this.web3 = web3Instance;
  }

  public async deployContract(from: string, abi: string) {
    const tx = await this.sendTx({
      from: from,
      data: abi
    });
    return tx.contractAddress;
  }

  public async runContractFunction(from: string, contract: string, abi: Record<string, unknown>, params: string[]) {
    await this.sendTx({
      from,
      to: contract,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: this.web3.eth.abi.encodeFunctionCall(abi as any, params)
    });
  }

  public async callContractFunction<T>(from: string, contract: string, abi: Record<string, unknown>, type: string) {
    return this.web3.eth.abi.decodeParameter(type, await this.web3.eth.call({
      from,
      to: contract,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: this.web3.eth.abi.encodeEventSignature(abi as any)
    })) as T;
  }

  public async sendEth(from: string, to: string, amount: BN | number | string) {
    await this.sendTx({
      from,
      to,
      value: new BN(amount)
    });
  }

  public async sendTx(args: {
    from: string, to?: string, data?: string, value?: BN, timestamp?: number, gasLimit?: string
  }) {
    return await this.web3.eth.sendTransaction({
      data: EMPTY,
      gasLimit: '0x2dc6c0',
      timestamp: Date.now(),
      ...args
    });
  }

}