import React, { useState } from 'react';
import Icon from './Icon';

export default function Input(props: {
  items: string[], className?: string, selected?: string, onSelected: (item: string) => void
}) {
  const [open, setOpen] = useState(false);

  return <div className={(props.className || '') +
  ` bg-vscode-dropdown-background text-vscode-dropdown-foreground border
    flex select-none cursor-pointer py-0.5 px-1 relative ` +
    (open ? 'border-vscode-focusBorder' : 'border-vscode-dropdown-border')
  } onClick={() => setOpen(!open)}>
    { props.selected ?
      <span className='flex-grow overflow-hidden text-ellipsis whitespace-nowrap'>{props.selected}</span>
      :
      <span className='flex-grow text-vscode-input-placeholderForeground'>Select item</span>
    }
    <Icon name='chevron-down' className='mr-0.5 mt-0.5' />
    { open &&
      <div className='absolute bg-vscode-dropdown-background left-[-1px] right-[-1px] top-6
                      border border-vscode-focusBorder max-h-40 p-[1px] z-50 overflow-y-auto'>
        { props.items.length ? props.items.map(item => (
          <div key={item}
            onClick={() => item !== props.selected && props.onSelected(item)}
            className={`border border-transparent hover:bg-vscode-editor-background
                       hover:border-vscode-focusBorder px-1 text-ellipsis overflow-hidden whitespace-nowrap ` +
                       (item === props.selected ? 'bg-vscode-editor-background' : '')}>
            {item}
          </div>
        )) : <div className='px-1 opacity-50'>
          No entries
        </div>}
      </div>
    }
  </div>;
}
