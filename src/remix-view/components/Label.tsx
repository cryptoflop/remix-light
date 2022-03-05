import React, { ReactNode } from 'react';

export default function Label(props: {  label: string, children?: ReactNode, className?: string }) {
  return <div className={props.className}>
    <div className='text-xs mb-0.5'>{props.label}</div>
    {props.children}
  </div>;
}