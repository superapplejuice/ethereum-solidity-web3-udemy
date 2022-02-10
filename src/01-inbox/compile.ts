import path from 'path';
import fs from 'fs';
import Web3 from 'web3';
import { compileSourceString } from 'solc-typed-ast';

import { handleCompilationErrors } from './compile.utils';
import { DEFAULT_MESSAGE, GAS_AMOUNT } from './consts';

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

const createInboxContract = async (
  web3: Web3,
  initialMessage: string = DEFAULT_MESSAGE,
  gas: number = GAS_AMOUNT,
) => {
  // Get list of accounts
  const accounts = await web3.eth.getAccounts();

  const contractData = await getContractData();
  const newContract = new web3.eth.Contract(JSON.parse(contractData.interface));

  // Use one of the accounts to deploy the contract
  const inboxContract = await newContract
    .deploy({ data: contractData.bytecode, arguments: [initialMessage] })
    .send({ from: accounts[0], gas });

  return { accounts, inboxContract };
};

export default createInboxContract;
