import React, { ReactNode } from 'react';

export default function Label(props: { children: ReactNode, label: string }) {
  return <div>
    <div className='text-xs mb-0.5'>{props.label}</div>
    {props.children}
  </div>;
}