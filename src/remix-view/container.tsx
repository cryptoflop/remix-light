import React, { useState } from 'react';
import Button from './components/Button';
import Checkbox from './components/Checkbox';
import Dropdown from './components/Dropdown';
import Label from './components/Label';
import { send } from './utils';

export default function Container() {
  const [useCompiler, setUseCompiler] = useState(true);
  const [compiler, setCompiler] = useState<string>();
  const [autoCompile, setAutoCompile] = useState(false);



  return <div className='flex flex-col space-y-4'>
    <Button onClick={() => send({ event: 'reload' })}>Reload</Button>
    <Checkbox state={useCompiler} onStateChanged={setUseCompiler}>Compiler</Checkbox>
    { useCompiler &&
      <>
        <Label label="Version">
          <Dropdown selected={compiler} items={['Version1', 'Version2', 'Version3']} onSelected={setCompiler} />
        </Label>
        <Checkbox state={autoCompile} onStateChanged={setAutoCompile}>Auto compile</Checkbox>
        <Button primary={true}>Compile</Button>
      </>
    }
    <div className='w-full border-b border-vscode-editorWidget-border'></div>
    <Dropdown selected={compiler} items={['Version1', 'Version2', 'Version3']} onSelected={setCompiler} />
  </div>;
}