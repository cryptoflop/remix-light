import React, { ReactNode } from 'react';

export default function AccordionHeader(props: {  children: ReactNode[] }) {
  return <div className='flex m-[-1px]'>
    {props.children.map((c, i) =>
      <div key={i} className='flex rounded-[3px] hover:bg-vscode-toolbar-hoverBackground py-[3px] px-[4px]'
        onClick={e => e.stopPropagation()}>
        {c}
      </div>
    )}
  </div>;
}