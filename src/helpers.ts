import { privateToAddress } from "ethereumjs-util";

export function privateKeyToAddress(privateKey: string) {
  return '0x' + privateToAddress(Buffer.from(privateKey.replace('0x', ''), 'hex')).toString('hex');
}