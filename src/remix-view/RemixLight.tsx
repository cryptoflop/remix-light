import React from 'react';
import Button from './components/Button';
import Checkbox from './components/Checkbox';
import Dropdown from './components/Dropdown';
import IconButton from './components/IconButton';
import Label from './components/Label';
import Deploy from './Deploy';
import DeployedContracts from './DeployedContracts';
import { useResource } from './hooks/useResource';
import { useTransform } from './hooks/useTransform';
import { send } from './utils';

const shortPath = (path: string): string => {
  const splits = path.split('/');
  return splits[splits.length - 2] + '/' + splits[splits.length - 1];
};

export default function RemixLight() {
  const [useCompiler, setUseCompiler] = useResource('useCompiler', true);
  const [autoCompile, setAutoCompile] = useResource('autoCompile', false);
  const [contracts] = useTransform(useResource<string[]>('contracts', []), contracts => contracts.map(shortPath));
  const [openedContract, setOpenedContract] = useTransform(
    useResource<string>('openedContract'),
    contract => contract && shortPath(contract)
  );

  const [account, setAccount] = useResource<string>('account');
  const [accounts] = useResource<string[]>('accounts', []);

  return <div className='flex flex-col space-y-4 h-[100vh]'>
    <Checkbox state={useCompiler} onStateChanged={setUseCompiler}>Compiler</Checkbox>
    { useCompiler &&
      <>
        <Checkbox state={autoCompile} onStateChanged={setAutoCompile}>Auto compile</Checkbox>
        <Label label="File">
          <Dropdown selected={openedContract} items={contracts} onSelected={c => setOpenedContract(c)} />
        </Label>
        <Button type="primary" onClick={() => send({ event: 'compile' })}>Compile</Button>
      </>
    }
    <div className='w-full border-b border-vscode-editorWidget-border'></div>
    <Label label="Account" className='relative'>
      <IconButton name='file-binary' title='Copy' className='rounded-none absolute z-10 top-[-23px] right-0 h-6'
        onClick={() => navigator.clipboard.writeText(account)} />
      <Dropdown selected={account} items={accounts} onSelected={setAccount} />
    </Label>
    <Deploy />
    <Label label="Deployed Contracts">
      <DeployedContracts />
    </Label>
  </div>;
}
