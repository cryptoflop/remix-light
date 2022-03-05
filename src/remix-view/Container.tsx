import React, { useState } from 'react';
import Button from './components/Button';
import Checkbox from './components/Checkbox';
import Dropdown from './components/Dropdown';
import Label from './components/Label';
import DeployedContracts from './DeployedContracts';
import { useResource } from './hooks/useResource';
import { useTransform } from './hooks/useTransform';
import { send } from './utils';

const shortPath = (path: string): string => {
  const splits = path.split('/');
  return splits[splits.length - 2] + '/' + splits[splits.length - 1];
};

export default function Container() {
  const [useCompiler, setUseCompiler] = useResource('useCompiler', true);
  const [autoCompile, setAutoCompile] = useResource('autoCompile', false);
  const [contracts] = useTransform(useResource<string[]>('contracts', []), contracts => contracts.map(shortPath));
  const [activeContract] = useTransform(useResource<string>('openedContract'), contract => contract && shortPath(contract));

  const [account, setAccount] = useState<string>();
  const [accounts] = useResource<string[]>('accounts', [], accs => !account && setAccount(accs[0]));

  const [contract, setContract] = useState<string>();
  const [compiledContracts] = useTransform(useResource<Record<string, boolean>>('compiledContracts', {}), contracts => {
    return Object.entries(contracts).filter(e => e[1])
      .map(e => e[0])
      .map(shortPath);
  });

  return <div className='flex flex-col space-y-4'>
    <Checkbox state={useCompiler} onStateChanged={setUseCompiler}>Compiler</Checkbox>
    { useCompiler &&
      <>
        <Checkbox state={autoCompile} onStateChanged={setAutoCompile}>Auto compile</Checkbox>
        <Label label="Contract">
          <Dropdown selected={activeContract} items={contracts} onSelected={c => send({ event: 'setActiveContract', data: c })} />
        </Label>
        <Button type="primary">Compile</Button>
      </>
    }
    <div className='w-full border-b border-vscode-editorWidget-border'></div>
    <Label label="Account">
      <Dropdown selected={account} items={accounts} onSelected={setAccount} />
    </Label>
    <Label label="Contract">
      <Dropdown selected={contract} items={compiledContracts} onSelected={setContract} />
    </Label>
    <Button type='accent'>Deploy</Button>
    <Label label="Deployed Contracts">
      <DeployedContracts />
    </Label>
  </div>;
}
