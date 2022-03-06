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

  constructor(private chain: Chain, private resources: Resources, cfw: ContractFileWatcher) {
    this.api = {
      deploy: (contractStr: string) => {
        const splits = contractStr.split(' - ');
        const file = cfw.files.find(f => f.path.includes(splits[1]));
        if (file) {
          this.deploy(file.path + '/' + splits[0]);
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
    const contract = this.contractById(id)!;
    const abi = contract.abi.find(d => d.name === fn)!;
    const paramList = [this.resources.account as string,
      contract.address,
      abi,
      abi.outputs.map(o => o.type),
      params] as const;
    const result = run ? await this.chain.runContractFunction(...paramList) : await this.chain.callContractFunction(...paramList);

    // in general this could be done more perfomant if we send results via an event not over a resource...
    this.resources.deployedContracts = {
      ...this.resources.deployedContracts as object,
      [id]: { ...contract, state: {
        ...contract.state,
        [fn]: Object.entries(result)
          .filter(e => !e[0].startsWith('_'))
          .map(e => e[1])
      } }
    } as DeployedContracts;
  }

  async deploy(id: string) {
    const contract = { ...((this.resources.compiledContracts as Record<string, CompiledContract>)[id]) };

    const address = await this.chain.deployContract(this.resources.account as string, contract.bytecode);

    this.resources.deployedContracts = {
      ...this.resources.deployedContracts as object,
      [id]: { ...contract, name: contract.name, address, state: {} }
    } as DeployedContracts;
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