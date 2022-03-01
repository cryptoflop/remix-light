import { sendTx } from './chain';

export default async function deployContract(from: string, abi: string) {
  try {
    const tx = await sendTx({
      from: from,
      to: undefined,
      data: abi
    });
    return tx.contractAddress;
  } catch (e) {
    console.error(e);
  }
}