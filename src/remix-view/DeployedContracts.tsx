import React from 'react';
import type { DeployedContract } from 'src/modules/ContractDeployer';
import AccordionHeader from './components/Accordion/AccordionHeader';
import AccordionItem from './components/Accordion/AccordionItem';
import IconButton from './components/IconButton';
import Contract from './Contract';
import { useResource } from './hooks/useResource';
import { useTransform } from './hooks/useTransform';
import { send } from './utils';

export default React.memo(function DeployedContracts() {
  const [deployedContracts] = useTransform(useResource<Record<string, DeployedContract>>('deployedContracts', {}), dc => {
    return Object.values(dc);
  });

  if (deployedContracts.length === 0) {
    return <div className='py-1 text-center opacity-50'>No contracts deployed</div>;
  }
  return <div className='flex flex-col'>
    { deployedContracts.map(dc => <AccordionItem key={dc.id} label={dc.name}>
      <AccordionHeader>
        <IconButton name='file-binary' title="Copy address" className="flex"
          onClick={() => navigator.clipboard.writeText(dc.address)} />
        <IconButton name='json' title="Copy compilation artifact" className="flex"
          onClick={() => navigator.clipboard.writeText(JSON.stringify(dc.abi))} />
        <IconButton name='trash' title="Delete" className="flex"
          onClick={() => send({ event: 'dispose', data: dc.id })} />
      </AccordionHeader>
      <div className='flex px-1 pb-2 pt-1'>
        <Contract contract={dc.id} />
      </div>
    </AccordionItem>)}
  </div>;
});