import React from 'react';
import Button from './components/Button';
import Input from './components/Input';
import Label from './components/Label';

export interface CompiledContract {
	name: string;
	abi: {
		name: string,
		inputs: { type: string, name: string }[];
		outputs: { type: string	}[];
		stateMutability: string;
		type: string;
	}[],
	bytecode: string;
}

const inputSignature = (inputs: CompiledContract['abi'][0]['inputs']): string => {
  return inputs.map(i => `${i.type}: ${i.name}`).join(', ');
};

export default function Contract(props: { contract: CompiledContract }) {
  return <div className='flex flex-col space-y-2 flex-grow'>
    <Label label='views' className='flex flex-col'>
      {props.contract.abi.filter(f => f.stateMutability.includes('view')).map(view => <div key={view.name} className="flex">
        <Button type='accent-secondary' className='px-1.5 py-0.5 min-w-[5rem] w-[30%] text-ellipsis overflow-hidden' title={view.name}>
          {view.name}
        </Button>
        <div className='flex-grow bg-vscode-input-background'></div>
      </div>)}
    </Label>
    <Label label='functions' className='flex flex-col'>
      {props.contract.abi.filter(f => !f.stateMutability.includes('view')).map(view => <div key={view.name} className="flex">
        <Button type='accent' className='px-1.5 py-0.5 min-w-[5rem] w-[30%] text-ellipsis overflow-hidden' title={view.name}>
          {view.name}
        </Button>
        <Input onInput={n => 1} placeholder={inputSignature(view.inputs)} className='flex-grow bg-vscode-dropdown-background' />
      </div>)}
    </Label>
  </div>;
}