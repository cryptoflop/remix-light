import React from 'react';

export default function Icon(props: { name: string, className?: string }) {
  return <i className={(props.className || '') + ' codicon codicon-' + props.name} />;
}