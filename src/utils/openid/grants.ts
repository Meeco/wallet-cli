import { GRANT_TYPES } from '../../types/openid.types.js';

function parseGrantTypes(grantType: string) {
  if (grantType === GRANT_TYPES.AUTHORIZATION_CODE) {
    return 'Authorization Code';
  }

  if (grantType === GRANT_TYPES.PREAUTHORIZED_CODE) {
    return 'Pre-authorized Code';
  }

  return grantType;
}

export function parseGrantTypesAsChoices(grants: string[]) {
  return grants.map((grantType: string) => ({
    name: parseGrantTypes(grantType),
    value: grantType,
  }));
}