import React, { ReactNode, useState } from 'react';
import Icon from '../Icon';
import AccordionHeader from './AccordionHeader';

export default function AccordionItem(props: {  label: string, children?: ReactNode | ReactNode[] }) {
  const [open, setOpen] = useState(false);
  const children = props.children instanceof Array ? props.children : [props.children];

  const header = children?.find(c => (c as JSX.Element).type === AccordionHeader);
  const content = children?.filter(c => c !== header);

  return <div className='flex flex-col w-full'>
    <div className="flex items-center text-vscode-dropdown-foreground hover:bg-vscode-toolbar-hoverBackground cursor-pointer h-6"
      onClick={() => setOpen(!open)}>
      <Icon name={open ? 'chevron-down' : 'chevron-right'} />
      <div className='ml-1 mr-auto text-ellipsis overflow-hidden whitespace-nowrap' style={{ lineHeight: '16px'}}>{props.label}</div>
      { header }
    </div>
    { open && <>
      {content}
      <div className='w-full border-b border-vscode-editorWidget-border mb-1'></div>
    </>}
  </div>;
}