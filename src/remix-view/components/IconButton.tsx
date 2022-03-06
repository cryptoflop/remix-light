import React from 'react';
import Icon from './Icon';

export default function IconButton(props: {
  name: string,
  onClick: React.MouseEventHandler<HTMLButtonElement>,
  className?: string,
  title?: string
}) {
  return <button className={(props.className ?? '') + ' rounded-[3px] hover:bg-vscode-toolbar-hoverBackground py-[4px] px-[4px]'}
    onClick={props.onClick}
    title={props.title}>
    <Icon name={props.name} />
  </button>;
}