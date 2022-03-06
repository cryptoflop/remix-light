import React, { ReactNode } from 'react';

export default function Label(props: {  label: string, children?: ReactNode, className?: string, containerClassName?: string }) {
  return <div className={props.containerClassName}>
    <div className='text-xs mb-0.5'>{props.label}</div>
    <div className={props.className}>
      {props.children}
    </div>
  </div>;
}