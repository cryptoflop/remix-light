import type { Uri } from 'vscode';
import type ContractFileWatcher from './ContractFileWatcher';
import type { Resources, ResourceSetObservable } from './Resources';

export default class Compiler {

  constructor(private resources: Resources, public cfw: ContractFileWatcher) {
    this.useCompilerChanged();
  }

  subscribeResources($resourceSet: ResourceSetObservable) {
    $resourceSet.subscribe(msg => {
      switch (msg.resource) {
      case 'useCompiler':
        this.useCompilerChanged();
        break;
      case 'autoCompile':
        if (msg.data) {
          this.compileAll();
        }
        break;
      }
    });
  }

  useCompilerChanged() {
    if (this.resources.useCompiler) {
      this.activateCompiler();
    } else {
      this.deactivateCompiler();
    }
  }

  activateCompiler() {
    1;
    if (this.resources.autoCompile) {
      this.compileAll();
    }
  }

  deactivateCompiler() {
    1;
  }

  compile(file: Uri) {
    if (!this.resources.useCompiler) return;
    this.resources.compiledContracts = { ...this.resources.compiledContracts as object, [file.path]: true };
  }

  compileAll() {
    for (const file of this.cfw.files) {
      this.compile(file);
    }
  }

}