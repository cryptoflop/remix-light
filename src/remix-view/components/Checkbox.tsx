import React, { ReactNode } from 'react';
import Icon from './Icon';

export default function Checkbox(props: {
	children: ReactNode, state: boolean, onStateChanged: (newState: boolean) => void
}) {
  return <div className='flex items-center cursor-pointer' onClick={() => props.onStateChanged(!props.state)}>
    <div className='bg-vscode-checkbox-background border border-vscode-checkbox-border rounded-[3px]
                    focus-within:border-vscode-focusBorder'>
      <div className='w-4 h-4'>
        { props.state && <Icon name='check' className='text-vscode-checkbox-foreground' /> }
      </div>
    </div>
    <div className='ml-2 text-vscode-checkbox-foreground'>
      {props.children}
    </div>
  </div>;
}