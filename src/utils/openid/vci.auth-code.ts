import http from 'node:http';
import open from 'open';
import { Issuer, generators } from 'openid-client';

import { IssuerMetadata } from './openid.types.js';

type getTokenFromAuthorizationTokenArgs = {
  clientId: string;
  host?: string;
  issuerState: string;
  metadata: IssuerMetadata;
  port?: string;
}

export async function getTokenFromAuthorizationToken({
  clientId,
  host = 'http://localhost',
  issuerState,
  metadata,
  port = '6363',
}: getTokenFromAuthorizationTokenArgs) {
  const listener = `${host}:${port}`;

  const issuer = new Issuer(metadata);

  const client = new issuer.Client({
    'client_id': clientId,
    'redirect_uris': [listener],
    'response_types': ['code'],
    'token_endpoint_auth_method': 'none',
  });

  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  const authorizationUrl = client.authorizationUrl({
    'code_challenge': codeChallenge,
    'code_challenge_method': 'S256',
    'issuer_state': issuerState,
    scope: 'openid',
  });

  let params: { [props: string]: unknown } = {};

  const server = http
    .createServer((req, res) => {
      if (req.url?.startsWith('/?')) {
        params = client.callbackParams(req);
        params.state = params.issuer_state;
        res.end('You can close this page now.');
      } else {
        res.end('Unsupported');
      }
    })
    .listen(port);

  await open(authorizationUrl);

  while (params.state === undefined) {
    // eslint-disable-next-line no-promise-executor-return, no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const token = await client.oauthCallback(listener, params, { 'code_verifier': codeVerifier });

  server.close();

  return token;
}
