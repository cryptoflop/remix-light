
import { BN } from 'bn.js';
import { sendTx, web3Instance } from './chain';

export default async function sendEth(acc1, acc2) {
  const web3 = web3Instance();

  console.log(await web3.eth.getBalance(acc1));
  console.log(await web3.eth.getBalance(acc2));

  // tx
  try {
    await sendTx({
      from: acc1,
      to: acc2,
      value: new BN(0)
    });
  } catch (e) {
    console.error(e);
  }

  console.log(await web3.eth.getBalance(acc1));
  console.log(await web3.eth.getBalance(acc2));
}