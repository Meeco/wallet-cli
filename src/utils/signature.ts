import { ed25519 } from '@noble/curves/ed25519';
import { EdDSASigner, createJWT } from 'did-jwt';
import multibase from 'multibase';
import * as multicodec from 'multicodec';
import * as u8a from 'uint8arrays';

function encodePublicKey(publicKey: Buffer, encoding: Uint8Array | multicodec.CodecName) {
  const keyBytes = multicodec.addPrefix(encoding, publicKey);
  const keyEncoded = multibase.encode('base58btc', keyBytes);
  return u8a.toString(keyEncoded);
}

export function createDidKey() {
  const privateKey = ed25519.utils.randomPrivateKey();
  const publicKey = ed25519.getPublicKey(privateKey);
  // eslint-disable-next-line unicorn/prefer-spread
  const secretKey = u8a.concat([privateKey, publicKey]);
  const identifier = `did:key:${encodePublicKey(publicKey as Buffer, 'ed25519-pub')}`;

  return {
    algorithm: 'EdDSA',
    identifier,
    method: 'KEY',
    privateKey,
    publicKey,
    secretKey,
  };
}

const signEdDSA = async (secretKey: Buffer, data: Buffer) => {
  // eslint-disable-next-line new-cap
  const signer = EdDSASigner(secretKey);
  const signature = await signer(data);
  return signature;
};

const getSigner = (secretKey: Buffer) => async (data: Buffer) => signEdDSA(secretKey, data);

type signJWTArgs = {
  [props: string]: unknown;
  header: object;
  options?: object;
  payload: object;
  secretKey: Uint8Array;
}

export const signJWT = (args: signJWTArgs) => {
  const options = {
    ...args.options,
    signer: getSigner(args.secretKey as Buffer),
  };

  return createJWT(args.payload, options, args.header);
};