import { ux } from '@oclif/core';
import http, { Server } from 'node:http';
import open from 'open';
import { AuthorizationParameters, CallbackParamsType, Client, Issuer, generators } from 'openid-client';

import { OpenidConfiguration } from '../../types/openid.types.js';

type getTokenFromAuthorizationCodeArgs = {
  clientId: string;
  host?: string;
  issuerState: string;
  openidConfig: OpenidConfiguration;
  port?: string;
};

type codeExchangeCallback = (server: Server, params: CallbackParamsType) => Promise<void>;

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
    client_id: clientId,
    token_endpoint_auth_method: 'none',
  });

  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  const authParams = {
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    issuer_state: issuerState,
    redirect_uri: listener,
    response_type: 'code',
    scope: 'openid',
  };

  const authorizationUrl = await getAuthorizationUrl(client, openidConfig, authParams);

  const { callback, promise } = getLocalCallbackFunction(client, listener, codeVerifier);
  await initLocalWebServer(client, port, callback);

  await open(authorizationUrl);

  return promise;
}

async function getAuthorizationUrl(
  client: Client,
  openidConfig: OpenidConfiguration,
  params: AuthorizationParameters,
): Promise<string> {
  let authorizationUrl: string;

  if (openidConfig.pushed_authorization_request_endpoint) {
    ux.action.start('using Pushed Authorization Request');

    const { request_uri } = await client.pushedAuthorizationRequest(params);

    if (!request_uri) {
      throw new Error('Failed to obtain request_uri from PAR');
    }

    authorizationUrl = client.authorizationUrl({ request_uri });

    ux.action.stop();
  } else {
    authorizationUrl = client.authorizationUrl(params);
  }

  return authorizationUrl;
}

async function initLocalWebServer(client: Client, port: string, callback: codeExchangeCallback) {
  let params: CallbackParamsType = {};

  const server = await http
    .createServer(async (req, res) => {
      if (req.url?.startsWith('/?')) {
        params = client.callbackParams(req);
        params.state = params.issuer_state as string;

        await callback(server, params);

        res.end('You can close this page now.');
      } else {
        res.end('Unsupported');
      }
    })
    .listen(port);
}

function getLocalCallbackFunction(
  client: Client,
  listener: string,
  codeVerifier: string,
): { callback: codeExchangeCallback; promise: Promise<unknown> } {
  let returnToken: (value: unknown) => void;
  let rejectToken: (value: unknown) => void;

  const promise = new Promise((resolve, reject) => {
    returnToken = resolve;
    rejectToken = reject;
  });

  const callback = async (server: Server, params: CallbackParamsType) => {
    const token = await client
      .oauthCallback(listener, params, {
        code_verifier: codeVerifier,
      })
      .catch((error: Error) => rejectToken(error));

    server.close();

    returnToken(token);
  };

  return {
    callback,
    promise,
  };
}
