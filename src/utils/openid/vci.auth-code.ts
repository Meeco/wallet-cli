import http from 'node:http';
import open from 'open';
import { Issuer, generators } from 'openid-client';

import { OpenidConfiguration } from '../../types/openid.types.js';

type getTokenFromAuthorizationCodeArgs = {
  clientId: string;
  host?: string;
  issuerState: string;
  openidConfig: OpenidConfiguration;
  port?: string;
}

export async function getTokenFromAuthorizationCode({
  clientId,
  host = 'http://localhost',
  issuerState,
  openidConfig,
  port = '6363',
}: getTokenFromAuthorizationCodeArgs) {
  const listener = `${host}:${port}`;

  const issuer = new Issuer(openidConfig);

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

  let returnToken: (value: unknown) => void;
  let rejectToken: (value: unknown) => void;
  
  const promise = new Promise((resolve, reject) => {
    returnToken = resolve;
    rejectToken = reject;
  });

  const completeFlow = async () => {
    const token = await client.oauthCallback(listener, params, { 
      'code_verifier': codeVerifier 
    }).catch((error) => rejectToken(error));

    server.close();

    returnToken(token);
  }

  const server = http
    .createServer((req, res) => {
      if (req.url?.startsWith('/?')) {
        params = client.callbackParams(req);
        params.state = params.issuer_state;

        completeFlow();

        res.end('You can close this page now.');        
      } else {
        res.end('Unsupported');
      }
    })
    .listen(port);

  await open(authorizationUrl);

  return promise;
}
