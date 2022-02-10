import path from 'path';
import fs from 'fs';
import { compileSourceString } from 'solc-typed-ast';
import { handleCompilationErrors } from './compile.utils';

type ContractData = {
  bytecode: string;
  runtimeBytecode: string;
  interface: string;
};

const INBOX_CONTRACT = 'Inbox';
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf-8');

const compile = async () => {
  try {
    return await compileSourceString(inboxPath, source, 'auto', []);
  } catch (e) {
    handleCompilationErrors(e);
  }
};

const getContractData = async (): Promise<ContractData> => {
  const result = await compile();
  return result?.data.contracts[`${inboxPath}:${INBOX_CONTRACT}`];
};

export default getContractData;
