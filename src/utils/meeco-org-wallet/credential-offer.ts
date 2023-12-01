import { generateRandomCode } from '../helpers.js';
import { GRANT_TYPES } from '../openid/openid.types.js';
import { CREDENTIAL_OFFER_ENDPOINT } from './constants.js';

type createCredentialOfferArgs = {
  claims: unknown;
  format: string;
  grantType: string;
  pinRequired: boolean;
  types: string[];
  url: string;
}

export async function createCredentialOffer({
  claims,
  format,
  grantType,
  pinRequired,
  types,
  url,
}: createCredentialOfferArgs) {
  const randomCode = generateRandomCode(22);

  let grants;
  if (grantType === GRANT_TYPES.PREAUTHORIZED_CODE) {
    grants = {
      'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
        'pre-authorized_code': randomCode,
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

  const payload = {
    credentialDataSupplierInput: {
      claims,
    },
    credentials: [
      {
        format,
        types,
      },
    ],
    grants,
  }

  return fetch(`${url}${CREDENTIAL_OFFER_ENDPOINT}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
}