import { Provider, extend } from '@remix-project/remix-simulator';
import type { Resources, SubscribableResources } from './Resources';
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

  constructor(private resources: Resources) {
    // maybe add fork selection?
    const chain = new Provider({ fork: 'london' });
    chain.init();
    const web3 = new Web3(chain);
    extend(web3);

    this.web3 = web3;
  }

  public registerResources(subscribableResources: SubscribableResources) {
    subscribableResources['accounts'] = async () => {
      const accounts = await this.web3.eth.getAccounts();
      if (!this.resources.account) {
        this.resources.account = accounts[0];
      }
      return accounts;
    };
  }

  public async deployContract(from: string, bytecode: string) {
    const tx = await this.sendTx({
      from: from,
      data: bytecode
    });
    return tx.contractAddress;
  }

  public async callContractFunction(from: string, contract: string, abi: Record<string, unknown>, types: string[], params: string[]) {
    return this.web3.eth.abi.decodeParameters(types, await this.web3.eth.call({
      from,
      to: contract,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: this.web3.eth.abi.encodeFunctionCall(abi as any, params)
    }));
  }

  public async runContractFunction(from: string, contract: string, abi: Record<string, unknown>, types: string[], params: string[]) {
    const tx = await this.sendTx({
      from,
      to: contract,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: this.web3.eth.abi.encodeFunctionCall(abi as any, params)
    });
    const result = await this.web3.eth.getExecutionResultFromSimulator(tx.transactionHash);
    return this.web3.eth.abi.decodeParameters(types, result.returnValue.toString('hex'));
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