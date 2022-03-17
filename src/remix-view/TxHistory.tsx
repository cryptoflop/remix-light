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

function TxStat(props: { label: string, value: string, success?: boolean }) {
  return <div className='flex flex-grow select-none'>
    <div className='min-w-[2.5rem]'>{`${props.label}:`}</div>
    <div className={`text-ellipsis overflow-hidden whitespace-nowrap hover:bg-vscode-toolbar-hoverBackground cursor-pointer px-0.5
        ${props.success === undefined ? '' : (props.success ? 'text-green-500' : 'text-red-500')}`}
    title='Copy'
    onClick={() => navigator.clipboard.writeText(props.value)}>
      {props.value}
    </div>
  </div>;
}

export default React.memo(function TxHistory() {
  const [txHistory, setTxHistory] = useResource<Tx[]>('txHistory', []);

  return <Label label="Tx History" containerClassName='relative pb-2' className='max-h-56 overflow-y-auto'>
    { txHistory?.length ?
      <>
        <IconButton name='clear-all' title="Copy address" className="absolute top-[-5px] right-0 h-6"
          onClick={() => setTxHistory([])} />
        { txHistory.map(tx => <AccordionItem key={tx.hash} label={buildTxTitle(tx)}>
          <div className='flex flex-col px-1 pb-2 pt-1 overflow-hidden'>
            <div className='flex'>
              <TxStat label='Status' value={tx.status ?? 'success'} success={(tx.status ?? 'success') === 'success'} />
              <TxStat label='Gas cost' value={tx.cost >= 80000000 ? '-' : tx.cost.toString()} />
            </div>

            <TxStat label='From' value={tx.from} />
            <TxStat label='To' value={tx.to} />
            <TxStat label='Hash' value={tx.hash} />
          </div>
        </AccordionItem>)}
      </> :
      <div className='py-1 text-center opacity-50'>No transactions recorded</div>
    }
  </Label>;
});