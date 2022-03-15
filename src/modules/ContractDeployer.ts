import { Subject } from 'rxjs';
import type * as vscode from 'vscode';
import type { Chain } from './Chain';
import type { CompiledContract } from './Compiler';
import type ContractFileWatcher from './ContractFileWatcher';
import type { Resources } from './Resources';

export interface DeployedContract extends CompiledContract {
	address: string;
	state: Record<string, unknown[]>
}

type DeployedContracts = Record<string, DeployedContract | undefined>;

export interface Tx {
  contract: string,
  from: string,
  to: string,
  cost: number,
  hash: string,
  status?: 'error' | 'success',
  fn?: string
}

export default class ContractDeployer {

  private eventSub = new Subject<Tx>();
  public $event = this.eventSub.asObservable();

  public api;

  constructor(private chain: Chain, private resources: Resources, cfw: ContractFileWatcher, private out: vscode.OutputChannel) {
    (this.resources.txHistory as Tx[]) = [];

    this.api = {
      deploy: (msg: { contract: string, params: string[] }) => {
        const splits = msg.contract.split(' - ');
        const file = cfw.files.find(f => f.path.includes(splits[1]));
        if (file) {
          this.deploy(file.path + '/' + splits[0], msg.params);
        }
      },
      dispose: (id: string) => this.dispose(id),
      call: (msg: { id: string, fn: string, params: string[] }) => this.fn(msg.id, msg.fn, msg.params, false),
      tx: (msg: { id: string, fn: string, params: string[] }) => this.fn(msg.id, msg.fn, msg.params, true),
      disposeState: (msg: { id: string, fn: string}) => this.disposeState(msg.id, msg.fn)
    };
  }

  private contractById(id: string) {
    return (this.resources.deployedContracts as DeployedContracts)[id];
  }

  private addTxToHistory(tx: Tx) {
    (this.resources.txHistory as Tx[]).push(tx);
    this.resources.txHistory = [...this.resources.txHistory as Tx[]];
  }

  private async fn(id: string, fn: string, params: string[], isTx: boolean) {
    try {
      const contract = this.contractById(id)!;
      const abi = contract.abi.find(d => d.name === fn)!;
      const paramList = [this.resources.account as string,
        contract.address,
        abi,
        abi.outputs.map(o => o.type),
        params] as const;
      const tx = isTx ? await this.chain.tx(...paramList) : await this.chain.call(...paramList);

      this.addTxToHistory({
        contract: contract.name,
        from: this.resources.account as string,
        to: contract.address,
        status: isTx ? 'success' : undefined,
        cost: tx.cost,
        hash: tx.hash
      });

      const resultEntries = Object.entries(tx.result).filter(e => !e[0].startsWith('_'));
      if (resultEntries.length > 0) {
        // in general this could be done more perfomant if we send results via an event not over a resource...
        this.resources.deployedContracts = {
          ...this.resources.deployedContracts as object,
          [id]: { ...contract, state: {
            ...contract.state,
            [fn]: resultEntries.map(e => e[1])
          } }
        } as DeployedContracts;
      }
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.out.appendLine((e as any)?.reason || e);
    }
  }

  async deploy(id: string, params: string[]) {
    try {
      const contract = { ...((this.resources.compiledContracts as Record<string, CompiledContract>)[id]) };

      const types = contract.abi.find(a => a.type === 'constructor')?.inputs.map(i => i.type) ?? [];

      const tx = await this.chain.deployContract(this.resources.account as string, contract.bytecode, types, params);

      this.addTxToHistory({
        contract: contract.name,
        from: this.resources.account as string,
        to: tx.address as string,
        status: 'success',
        cost: tx.cost,
        hash: tx.hash
      });

      this.resources.deployedContracts = {
        ...this.resources.deployedContracts as object,
        [id]: { ...contract, name: contract.name, address: tx.address, state: {} }
      } as DeployedContracts;
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.out.appendLine((e as any)?.reason || e);
    }
  }

  dispose(id: string) {
    this.resources.deployedContracts = {
      ...this.resources.deployedContracts as object,
      [id]: undefined
    } as DeployedContracts;
  }

  disposeState(id: string, fn: string) {
    const contract = this.contractById(id)!;
    this.resources.deployedContracts = {
      ...this.resources.deployedContracts as object,
      [id]: { ...contract, state: {
        ...contract.state,
        [fn]: undefined
      } }
    } as DeployedContracts;
  }

}