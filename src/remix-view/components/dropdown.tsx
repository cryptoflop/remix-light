import React from 'react';

export default function Dropdown(props: { className?: string, items: string[] }) {
  return <div className={(props.className || '') +
  ' bg-vscode-input-background text-vscode-input-foreground'
  } onClick={() => 1}>
    <input className='bg-transparent w-full outline-none px-[5px] py-[3px] focus-outline' />
  </div>;
}