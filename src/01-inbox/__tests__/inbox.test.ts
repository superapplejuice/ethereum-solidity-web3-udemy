import ganache from 'ganache';
import Web3 from 'web3';
import getContractData from '../compile';

const GAS_AMOUNT = 1000000;
const DEFAULT_MESSAGE = 'hello world';

const setupContract = async () => {
  const provider = ganache.provider();
  const web3 = new Web3(provider as any);

  // Get list of accounts
  const accounts = await web3.eth.getAccounts();

  const contractData = await getContractData();
  const newContract = new web3.eth.Contract(JSON.parse(contractData.interface));

  // Use one of the accounts to deploy the contract
  const inboxContract = await newContract
    .deploy({ data: contractData.bytecode, arguments: [DEFAULT_MESSAGE] })
    .send({ from: accounts[0], gas: GAS_AMOUNT });

  return { accounts, inboxContract };
};

afterEach(jest.clearAllMocks);

describe('Inbox contract testing', () => {
  it('should deploy a contract', async () => {
    const { inboxContract } = await setupContract();

    expect(inboxContract.options.address).toBeTruthy();
  });

  it('should have an initial value of `hello world`', async () => {
    const { inboxContract } = await setupContract();
    const message = await inboxContract.methods.message().call();

    expect(message).toEqual(DEFAULT_MESSAGE);
  });

  it('should have an updated message', async () => {
    const { inboxContract, accounts } = await setupContract();
    const updatedMessage = 'goodbye world';

    let message = await inboxContract.methods.message().call();
    expect(message).toEqual(DEFAULT_MESSAGE);

    await inboxContract.methods
      .setMessage(updatedMessage)
      .send({ from: accounts[0] });
    message = await inboxContract.methods.message().call();

    expect(message).toEqual(updatedMessage);
  });
});
