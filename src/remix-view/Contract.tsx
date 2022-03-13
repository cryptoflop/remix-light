import React, { useCallback, useRef } from 'react';
import type { CompiledContract } from 'src/modules/Compiler';
import type { DeployedContract } from 'src/modules/ContractDeployer';
import Button from './components/Button';
import IconButton from './components/IconButton';
import Input from './components/Input';
import Label from './components/Label';
import { useResource } from './hooks/useResource';
import { send } from './utils';

const sendFn = (type: 'call' | 'run', contractId: string, fn: string, params = '') => {
  send({ event: type, data: { id: contractId, fn, params: params.split(',')
    .map(p => p.trim())
    .filter(p => p) } });
};

function useDeployedContract(id: string) {
  const [deployedContracts] = useResource<Record<string, DeployedContract>>('deployedContracts', {});
  return deployedContracts[id];
}

const inputPlaceholder = (inputs: CompiledContract['abi'][0]['inputs']): string => {
  return inputs.map(i => `${i.type}: ${i.name}`).join(', ');
};

function ContractFunctions(props: {
  contract: DeployedContract,
  filter: (abi: DeployedContract['abi'][0]) => boolean,
  label: string,
  onClick: (fn: string, params: string) => void,
  type: string
}) {
  const inputState = useRef<Record<string, string>>({});

  const setInputState = useCallback((v: string, name: string) => {
    inputState.current[name] = v;
  }, [inputState.current]);

  const fns = props.contract.abi
    .filter(f => f.type === 'function')
    .filter(props.filter);

  return fns.length ? <Label label={props.label} className='flex flex-col first:mt-0 space-y-2'>
    { fns.map(view => <div key={view.name} className="flex flex-col">
      <div className='flex'>
        <Button type={props.type as 'accent'} className='px-1.5 py-0.5 min-w-[5rem] basis-0 flex-grow-[2] text-ellipsis overflow-hidden'
          onClick={() => props.onClick(view.name, inputState.current[view.name])}
          title={view.name}>
          {view.name}
        </Button>
        { view.inputs.length > 0 &&
            <Input onInput={v => setInputState(v, view.name)} placeholder={inputPlaceholder(view.inputs)} className='flex-grow-[2]' />
        }
      </div>
      { props.contract.state[view.name] &&
          <div className='grid relative'>
            { props.contract.state[view.name].map((v, i) => <span key={i}
              className='hover:bg-vscode-toolbar-hoverBackground cursor-pointer py-0.5 px-0.5 text-ellipsis
                          overflow-hidden whitespace-nowrap  first:pr-[20px]'
              title='Copy'>
              {view.outputs[i].type + ': ' +  v as string}
            </span>)}
            <IconButton name='trash' title="Delete results" className="flex absolute right-0 rounded-none" onClick={() => {
              send({ event: 'disposeState', data: { id: props.contract.id, fn: view.name } });
            }} />
          </div>
      }
    </div>)}
  </Label> : <></>;
}

export default React.memo(function Contract(props: { contract: string }) {
  const contract = useDeployedContract(props.contract);

  if (!contract?.abi) {
    return <></>;
  }
  return <div className='flex flex-col space-y-2 flex-grow'>
    <ContractFunctions contract={contract} label='Views' filter={f => f.stateMutability.includes('view')}
      onClick={(fn, params) => sendFn('call', contract.id, fn, params)} type='accent-secondary'
    />
    <ContractFunctions contract={contract} label='Functions' filter={f => !f.stateMutability.includes('view')}
      onClick={(fn, params) => sendFn('run', contract.id, fn, params)} type='accent'
    />
  </div>;
}, (p, n) => p.contract === n.contract);