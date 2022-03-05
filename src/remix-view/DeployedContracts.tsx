import React from 'react';
import AccordionHeader from './components/Accordion/AccordionHeader';
import AccordionItem from './components/Accordion/AccordionItem';
import Icon from './components/Icon';
import Label from './components/Label';
import type { CompiledContract } from './Contract';
import Contract from './Contract';
import { useResource } from './hooks/useResource';

export default function DeployedContracts() {
  const [deployedContracts] = useResource<CompiledContract[]>('deployedContracts', [{ name: 'Storage',
    abi: [{
      'name': 'spawExactTokenForTokens',
      'inputs': [
        {
          'name': 'num',
          'type': 'uint256'
        }
      ],
      'outputs': [],
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'name': 'retrieve',
      'inputs': [],
      'outputs': [
        {
          'type': 'uint256'
        }
      ],
      'stateMutability': 'view',
      'type': 'function'
    }], bytecode: '' }]);

  if (deployedContracts.length === 0) {
    return <Label label='No contracts deployed' />;
  }
  return <div className='flex flex-col'>
    { deployedContracts.map((c, i) => <AccordionItem key={i} label={c.name}>
      <AccordionHeader>
        <Icon name='file-binary' title="Copy address" />
        <Icon name='json' title="Copy compilation artifact" />
        <Icon name='trash' title="Delete" />
      </AccordionHeader>
      <div className='flex px-1'>
        <Contract contract={c} />
      </div>
    </AccordionItem>)}
  </div>;
}