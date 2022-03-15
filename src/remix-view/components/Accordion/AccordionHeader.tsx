import React, { ReactNode } from 'react';

export default function AccordionHeader(props: {  children: ReactNode | ReactNode[] }) {
  const children = props.children instanceof Array ? props.children : [props.children];

  return <div className='flex'>
    {children.map((c, i) =>
      <div key={i} onClick={e => e.stopPropagation()}>
        {c}
      </div>
    )}
  </div>;
}