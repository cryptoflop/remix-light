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

export default class ContractDeployer {

  public api;

  constructor(private chain: Chain, private resources: Resources, cfw: ContractFileWatcher, private out: vscode.OutputChannel) {
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
      run: (msg: { id: string, fn: string, params: string[] }) => this.fn(msg.id, msg.fn, msg.params, true),
      disposeState: (msg: { id: string, fn: string}) => this.disposeState(msg.id, msg.fn)
    };
  }

  private contractById(id: string) {
    return (this.resources.deployedContracts as DeployedContracts)[id];
  }

  private async fn(id: string, fn: string, params: string[], run: boolean) {
    try {
      const contract = this.contractById(id)!;
      const abi = contract.abi.find(d => d.name === fn)!;
      const paramList = [this.resources.account as string,
        contract.address,
        abi,
        abi.outputs.map(o => o.type),
        params] as const;
      const result = run ? await this.chain.runContractFunction(...paramList) : await this.chain.callContractFunction(...paramList);

      const resultEntries = Object.entries(result).filter(e => !e[0].startsWith('_'));
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

      const address = await this.chain.deployContract(this.resources.account as string, contract.bytecode, types, params);

      this.resources.deployedContracts = {
        ...this.resources.deployedContracts as object,
        [id]: { ...contract, name: contract.name, address, state: {} }
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