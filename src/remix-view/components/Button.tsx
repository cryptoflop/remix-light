import React, { ReactNode } from 'react';

const COLORS = {
  primary: 'bg-vscode-button-background hover:bg-vscode-button-hoverBackground text-vscode-button-foreground',
  secondary: 'bg-vscode-button-secondaryBackground hover:bg-vscode-button-secondaryHoverBackground text-vscode-button-secondaryForeground',
  accent: 'bg-remix-action-accent hover:bg-remix-action-accent-highlight text-vscode-button-foreground',
  'accent-secondary': 'bg-remix-action-accent-secondary hover:bg-remix-action-accent-secondary-highlight text-vscode-button-foreground'
};

export default function Button(props: {
  onClick?: () => void, children?: ReactNode, className?: string, type?: 'primary' | 'secondary'  | 'accent' | 'accent-secondary',
  title?: string
}) {
  return <button
    style={{ lineHeight: '20px' }}
    className={(props.className || '') + ' px-2 py-1 ' + COLORS[props.type ?? 'secondary']}
    onClick={props.onClick}
    title={props.title}>
    {props.children}
  </button>;
}
