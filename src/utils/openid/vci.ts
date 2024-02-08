import { ux } from '@oclif/core';
import { prompt } from '@oclif/core/lib/cli-ux/prompt.js';
import { randomUUID } from 'node:crypto';
import { TokenSet } from 'openid-client';

import { Credential, CredentialMetadata } from '../../types/create-credential-offer.types.js';
import {
  CredentialOfferDetails,
  GRANT_TYPES,
  IssuerMetadata,
  SupportedCredentialMap,
  WELL_KNOWN,
} from '../../types/openid.types.js';
import { isVcSdJwt, parseFetchResponse, printFetchError } from '../helpers.js';
import { getOpenidConfiguration } from './openid-config.js';
import { getTokenFromAuthorizationCode } from './vci.auth-code.js';
import { getJwtVcJsonProof, getSdJwtVcJsonProof } from './vci.proof-jwt.js';

export async function getIssuerMetadata(issuer: string): Promise<IssuerMetadata> {
  return fetch(`${issuer}/${WELL_KNOWN.OPENID_CREDENTIAL_ISSUER}`)
    .then((res) => res.json())
    .catch((error) => {
      printFetchError(error);
    });
}

type supportedCredentialMetadata = {
  [type: string]: CredentialMetadata;
};

type CredentialChoice = {
  description: string;
  name: string;
  value: Credential;
};

class CredentialOfferError extends Error {
  constructor(message = '') {
    super(message);
  }
}

function parseSupportedCredential(credentialIdentifier: string, credential: CredentialMetadata): CredentialChoice {
  const credentialTypes = credential.credential_definition.type ??
    credential.credential_definition.type ?? [credential.credential_definition.vct as string];

  const vc: Credential = {
    credentialIdentifier,
    format: credential.format,
    id: credential.id,
    name: credential.display[0].name,
    types: credentialTypes,
  };

  return {
    description: `${vc.name} (${vc.format})`,
    name: `${vc.name} (${vc.format})`,
    value: vc,
  };
}

export function getCredentialsSupportedAsChoices(
  metadata: Array<CredentialMetadata> | supportedCredentialMetadata,
): CredentialChoice[] {
  if (Array.isArray(metadata)) {
    return metadata.map((credential) => parseSupportedCredential('', credential));
  }

  if (typeof metadata === 'object') {
    return Object.keys(metadata).map((key) => {
      const credentialMetadata = <CredentialMetadata>(metadata as supportedCredentialMetadata)[key];
      return parseSupportedCredential(key, credentialMetadata);
    });
  }

  throw new Error('Unable to parse credentials_supported in issuer metadata');
}

export function parseCredentialOffer(input: string) {
  const matches = [...input.trim().matchAll(/credential_offer_uri=(.*)$/g)][0];
  return decodeURIComponent(matches[1]);
}

export async function claimCredentialOffer(credentialOfferURL: string) {
  ux.action.start('fetch credential offer');

  const result = await fetch(credentialOfferURL)
    .then((res) => res.json())
    .catch((error) => {
      printFetchError(error);
    });

  ux.action.stop();

  const { credential_issuer: issuer, credentials, grants } = result;

  ux.action.start(`get issuer metadata from ${issuer}`);
  const issuerMetadata = await getIssuerMetadata(issuer);
  const credentialMetadata = getCredentialInfo(credentials, issuerMetadata);
  ux.action.stop();

  const authorizationServer = issuerMetadata.authorization_server ?? issuer;
  ux.action.start(`get openid config from ${authorizationServer}`);
  const openidConfig = await getOpenidConfiguration(authorizationServer);
  ux.action.stop();

  const preAuthGrant = grants[GRANT_TYPES.PREAUTHORIZED_CODE];
  const authorizationGrant = grants[GRANT_TYPES.AUTHORIZATION_CODE];

  let token;

  if (preAuthGrant) {
    const userPin = grants?.[GRANT_TYPES.PREAUTHORIZED_CODE]?.user_pin_required
      ? await prompt(`Credential offer is protected with use PIN. Please enter one and press enter: `)
      : undefined;

    ux.action.start('get token using pre-authorized_code');

    const tokenEndpoint = openidConfig.token_endpoint;

    token = await exchangePreauthCodeWithToken(tokenEndpoint, preAuthGrant['pre-authorized_code'], userPin);

    ux.action.stop();
  } else if (authorizationGrant) {
    ux.action.start('get token from Authorization Code');

    token = await getTokenFromAuthorizationCode({
      clientId: randomUUID() as string,
      issuerState: authorizationGrant.issuer_state,
      openidConfig,
    });

    ux.action.stop();
  } else {
    throw new Error('could not find a supported grant type');
  }

  return issueVC(issuer, issuerMetadata.credential_endpoint, token, credentialMetadata);
}

async function exchangePreauthCodeWithToken(endpoint: string, code: string, userPin?: string) {
  const payload = {
    grant_type: GRANT_TYPES.PREAUTHORIZED_CODE,
    'pre-authorized_code': code,
    user_pin: userPin,
  };

  const formPayload = Object.keys(payload)
    .map((key: string) => key + '=' + payload[key as keyof typeof payload])
    .join('&');

  return fetch(endpoint, {
    body: formPayload,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'post',
  })
    .then(async (res) => {
      if (res.status >= 400) {
        await printFetchError(res, 'POST /token HTTP request failed.');
        throw new Error('failed to get token');
      }

      return res;
    })
    .then((res) => res.json());
}

type CredentialOfferMetadata = {
  credential_definition?: {
    type?: string[];
    vct?: string;
  };
  format: string;
};

export async function issueVC(issuer: string, endpoint: string, token: TokenSet, metadata: CredentialOfferMetadata) {
  /**
   * Get VC
   */

  const jwt = isVcSdJwt(metadata) ? await getSdJwtVcJsonProof(issuer, token) : await getJwtVcJsonProof(issuer, token);

  const vcPayload = {
    ...metadata,
    proof: {
      jwt,
      proof_type: 'jwt',
    },
  };

  const result = await fetch(endpoint, {
    body: JSON.stringify(vcPayload),
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
    },
    method: 'post',
  }).then((res) => parseFetchResponse(res));

  return result?.credential;
}

export function getCredentialInfo(
  credentials: Array<CredentialOfferDetails>,
  issuerMetadata: IssuerMetadata,
): CredentialOfferMetadata {
  if (typeof credentials[0] !== 'string') {
    throw new CredentialOfferError('Unsupported format of credential_offer.credentials');
  }

  const credentialIdentifier = credentials[0];
  const credentialMetadata = (issuerMetadata.credentials_supported as SupportedCredentialMap)[credentialIdentifier];

  return isVcSdJwt(credentialMetadata)
    ? {
        credential_definition: {
          vct: credentialMetadata.credential_definition.vct as string,
        },
        format: credentialMetadata.format,
      }
    : {
        credential_definition: {
          type: credentialMetadata.credential_definition.type,
        },
        format: credentialMetadata.format,
      };
}
