import React, { ReactNode } from 'react';

export default function Button(props: { onClick?: () => void, children?: ReactNode, className?: string }) {
  return <button className={(props.className || '') +
  ` px-2 py-1 bg-vscode-button-secondaryBackground hover:bg-vscode-button-secondaryHoverBackground
   text-vscode-button-secondaryForeground`}
  onClick={props.onClick}>{props.children}</button>;
}