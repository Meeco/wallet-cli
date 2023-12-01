import { SignJWT, importJWK } from 'jose';
import { readFile } from 'node:fs/promises';
import { TokenSet } from 'openid-client';

import { createDidKey, signJWT } from '../signature.js';
import { SIGNING_ALG } from './openid.types.js';

export async function getJwtVcJsonProof(issuer: string, token: TokenSet) {
  const didKey = createDidKey();

  const jwt = await signJWT({
    algorithm: didKey.algorithm,
    header: { alg: didKey.algorithm, kid: didKey.identifier, typ: 'openid4vci-proof+jwt' },
    options: { issuer: didKey.identifier },
    payload: {
      aud: issuer,
      exp: Math.floor(Date.now() / 1000) + 60 * 2,
      iss: didKey.identifier,
      nonce: token.c_nonce,
    },
    secretKey: didKey.secretKey,
  });

  return jwt;
}

export async function getSdJwtVcJsonProof(issuer: string, token: TokenSet) {
  const holder = await readFile('./config/holder.json').then((data) => JSON.parse(data.toString()));
  
  const privateKey = await importJWK(holder.jwk);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { d: _d, ...publicKey } = holder.jwk; 

  const jwt: string = await new SignJWT({
    aud: issuer,
    exp: Math.floor(Date.now() / 1000) + 60 * 2,
    iss: holder.uri,
    nonce: token.c_nonce,
  })
    .setProtectedHeader({ alg: SIGNING_ALG.ES256, jwk: publicKey, typ: 'openid4vci-proof+jwt' })
    .setIssuedAt()
    .sign(privateKey);

  return jwt;
}