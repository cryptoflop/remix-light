import React, { useState } from 'react';
import type { CompiledContract } from 'src/modules/Compiler';
import Button from './components/Button';
import Dropdown from './components/Dropdown';
import Input from './components/Input';
import Label from './components/Label';
import { useResource } from './hooks/useResource';
import { send } from './utils';

const deploy = (contract: string, params = '') => {
  send({ event: 'deploy', data: { contract, params: params.split(',')
    .map(p => p.trim())
    .filter(p => p) } });
};

const inputPlaceholder = (inputs: CompiledContract['abi'][0]['inputs']): string => {
  return inputs.map(i => `${i.type}: ${i.name}`).join(', ');
};

export default React.memo(function Deploy() {
  const [contract, setContract] = useState<string>();
  const [compiledContracts] = useResource<Record<string, CompiledContract>>('compiledContracts', {});
  const compiledContractsList = Object.values(compiledContracts).map(cc => cc.name);

  const selectedContract = Object.values(compiledContracts).find(cc => cc.name === contract);
  const constructorInputs = selectedContract?.abi.find(a => a.type === 'constructor')?.inputs;

  const [deployParams, setDeployParams] = useState<string>();

  return <>
    <Label label="Compiled contracs">
      <Dropdown selected={contract} items={compiledContractsList} onSelected={setContract} />
    </Label>
    { selectedContract && <div className='flex'>
      <Button type='accent' onClick={() => deploy(contract!, deployParams)} className="flex-grow">
				Deploy
      </Button>
      { !!constructorInputs?.length  && <Input className='flex-grow-[2]'
        onInput={v => setDeployParams(v)} placeholder={inputPlaceholder(constructorInputs)}
      /> }
    </div>}
  </>;
});




