import React from 'react';
import type { Tx } from 'src/modules/ContractDeployer';
import AccordionItem from './components/Accordion/AccordionItem';
import IconButton from './components/IconButton';
import Label from './components/Label';
import { useResource } from './hooks/useResource';

const buildTxTitle = (tx: Tx) => {
  let title = '';
  if (tx.fn) {
    title = `${ tx.status ? 'Tx' : 'Call' }: ${tx.contract}.${tx.fn}`;
  } else {
    title = `Deploy: ${tx.contract}`;
  }
  return title;
};

export default React.memo(function TxHistory() {
  const [txHistory] = useResource<Tx[]>('txHistory', []);

  return <Label label="Tx History" containerClassName='relative h-56'>
    <IconButton name='clear-all' title="Copy address" className="absolute top-[-5px] right-0 h-6"
      onClick={() => 1} />
    { txHistory.map(tx => <AccordionItem key={tx.hash} label={buildTxTitle(tx)}>
      <div className='flex flex-col px-1 pb-2 pt-1 overflow-hidden'>
        <div>Status: {tx.status}</div>
        <div>Gas: {tx.cost}</div>
        <div>From: {tx.from}</div>
        <div>To: {tx.to}</div>
        <div>Hash: {tx.hash}</div>
      </div>
    </AccordionItem>)}
  </Label>;
});