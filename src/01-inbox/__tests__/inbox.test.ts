import ganache from 'ganache';
import Web3 from 'web3';

import { DEFAULT_MESSAGE } from '../consts';
import createInboxContract from '../compile';

const setupContract = async () => {
  const provider = ganache.provider();
  const web3 = new Web3(provider as any);

  return createInboxContract(web3);
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
