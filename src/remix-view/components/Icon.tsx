import React from 'react';

export default function Icon(props: { name: string, className?: string, title?: string, onClick?: () => void }) {
  return <i className={(props.className || '') + ' codicon codicon-' + props.name} title={props.title} onClick={props.onClick} />;
}