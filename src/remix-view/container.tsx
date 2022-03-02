import React from 'react';
import Button from './components/button';
import Dropdown from './components/dropdown';
import { send } from './utils';

export default function Container() {

  return <div className='flex flex-col space-y-2'>
    <Button onClick={() => send({ event: 'reload' })}>Reload</Button>
    <Dropdown items={['Test1', 'Test2', 'Test3']} />
  </div>;
}