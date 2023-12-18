import { GRANT_TYPES } from '../../types/openid.types.js';
import { generateRandomCode, parseFetchResponse } from '../helpers.js';
import { CREDENTIAL_OFFER_ENDPOINT } from './constants.js';

export type createCredentialOfferArgs = {
  claims: unknown;
  credentialIdentifiers?: string[];
  format?: string;
  grantType: string;
  pinRequired: boolean;
  types?: string[];
  url: string;
  userPin?: string;
}

export async function createCredentialOffer({
  claims,
  credentialIdentifiers,
  format,
  grantType,
  pinRequired,
  types,
  url,
  userPin,
}: createCredentialOfferArgs) {
  const randomCode = generateRandomCode(22);

  let grants;
  if (grantType === GRANT_TYPES.PREAUTHORIZED_CODE) {
    grants = {
      'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
        'pre-authorized_code': randomCode,
        'user_pin': userPin,
        'user_pin_required': pinRequired,
      },
    };
  } else if (grantType === GRANT_TYPES.AUTHORIZATION_CODE) {
    grants = {
      'authorization_code': {
        'issuer_state': randomCode,
      },
    };
  }

  const credentials = credentialIdentifiers ?? [ { format, types } ];

  const payload = {
    credentialDataSupplierInput: {
      claims,
    },
    credentials,
    grants,
  }

  return fetch(`${url}${CREDENTIAL_OFFER_ENDPOINT}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  .then((res) => parseFetchResponse(res));
}