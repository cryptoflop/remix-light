import React from 'react';

export default function Input(props: { onInput: (newValue: string) => void, className?: string, placeholder?: string }) {
  return <div className={(props.className || '') +
  ' bg-vscode-input-background text-vscode-input-foreground'
  } onClick={() => 1}>
    <input className='bg-transparent w-full h-full outline-none px-1.5 py-1 focus-outline'
      onInput={e => props.onInput(e.currentTarget.value)}
      placeholder={props.placeholder} />
  </div>;
}