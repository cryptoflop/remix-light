import React, { ReactNode } from 'react';

export default function AccordionHeader(props: {  children: ReactNode[] }) {
  return <div className='flex'>
    {props.children.map((c, i) =>
      <div key={i} onClick={e => e.stopPropagation()}>
        {c}
      </div>
    )}
  </div>;
}