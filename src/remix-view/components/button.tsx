import React, { ReactNode } from 'react';

export default function Button(props: {
  onClick?: () => void, children?: ReactNode, className?: string, primary?: boolean
}) {
  return <button className={(props.className || '') + ' px-2 py-1 ' +
  (props.primary ?
    'bg-vscode-button-background hover:bg-vscode-button-hoverBackground text-vscode-button-foreground'
    :
    'bg-vscode-button-secondaryBackground hover:bg-vscode-button-secondaryHoverBackground text-vscode-button-secondaryForeground'
  )
  }
  onClick={props.onClick}>{props.children}</button>;
}