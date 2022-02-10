import { CompileFailedError } from 'solc-typed-ast';

export const handleCompilationErrors = (e: unknown) => {
  if (e instanceof CompileFailedError) {
    console.error('Compile errors encountered:');

    for (const failure of e.failures) {
      console.error(`Solidity compiler ${failure.compilerVersion}:`);

      for (const error of failure.errors) {
        console.error(error);
      }
    }
  } else {
    console.error(e as Error);
  }
};
