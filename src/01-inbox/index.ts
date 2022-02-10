import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';

import { CRYPTO_MNEMONIC, RINKEBY_NETWORK_URL } from './consts';
import createInboxContract from './compile';

const walletProvider = new HDWalletProvider(
  CRYPTO_MNEMONIC,
  RINKEBY_NETWORK_URL,
);
const web3 = new Web3(walletProvider);

const deploy = async () => {
  // eslint-disable-next-line no-console
  console.log('💻 Deploying contract...');

  const { inboxContract } = await createInboxContract(web3);
  return inboxContract.options.address;
};

deploy().then(address => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Contract successfully deployed to ${address}!`);
});
