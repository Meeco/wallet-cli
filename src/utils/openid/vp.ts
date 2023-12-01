import { JWK, SignJWT, calculateJwkThumbprint, decodeJwt, importJWK } from 'jose';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';

import { IdTokenPayload, JWT_TYPE, PresentationRequest, SIGNING_ALG, SIOP } from './openid.types.js';

export function parsePresentationRequestURI(input: string) {
  const matches = [...input.matchAll(/request_uri=(.*)$/g)][0];
  return decodeURIComponent(matches[1]);
}

type SDJWT = {
  cnf: {
    jwk: JWK
  };
};

async function createSdJwtVpToken(audience: string, nonce: number, compactSdJwtVC: string, privateKey: Buffer) {
  const { jwk } = (decodeJwt(compactSdJwtVC) as SDJWT).cnf;

  const kbJWT = await new SignJWT({ aud: audience, nonce })
    .setIssuedAt()
    .setProtectedHeader({
      alg: SIGNING_ALG.ES256,
      typ: JWT_TYPE.KEY_BINDING_JWT,
    })
    .sign(privateKey);

  const sdJwtVcWithKb = `${compactSdJwtVC}${kbJWT}`;

  return {
    jwk,
    vpToken: sdJwtVcWithKb,
  };
}

async function createSdJwtIdToken(requestPayload: PresentationRequest, definitionId: string, jwk: JWK, privateKey: Buffer) {
  const descriptorMap = [
    {
      format: JWT_TYPE.VC_SD_JWT,
      id: definitionId,
      path: '$',
    },
  ];

  const _vpToken = {
    'presentation_submission': {
      'definition_id': definitionId,
      'descriptor_map': descriptorMap,
      id: randomUUID(),
    },
  };

  const idTokenPayload: IdTokenPayload = {
    '_vp_token': _vpToken,
    aud: requestPayload.iss,
    exp: requestPayload.exp,
    nonce: requestPayload.nonce,
    sub: await calculateJwkThumbprint(jwk, 'sha256'),
    'sub_jwk': jwk,
  };

  return new SignJWT(idTokenPayload)
    .setIssuer(SIOP.V2)
    .setIssuedAt()
    .setProtectedHeader({ alg: SIGNING_ALG.ES256, typ: JWT_TYPE.JWT })
    .sign(privateKey);
}

export async function generatePresentationRequestSubmission(requestPayload: PresentationRequest, vc: string) {
  const definitionId = requestPayload?.claims?.vp_token?.presentation_definition?.id;

  const holder = await readFile('./config/holder.json').then((data) => JSON.parse(data.toString()));

  const privateKeyBytes = <Buffer>await importJWK(holder.jwk, SIGNING_ALG.ES256);

  const { jwk, vpToken } = await createSdJwtVpToken(requestPayload.iss, requestPayload.nonce, vc, privateKeyBytes);
  const IdToken = await createSdJwtIdToken(requestPayload, definitionId as string, jwk, privateKeyBytes);

  return {
    'id_token': IdToken,
    state: requestPayload.state,
    'vp_token': vpToken,
  };
}