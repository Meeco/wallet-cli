import { OpenidConfiguration, WELL_KNOWN } from '../../types/openid.types.js';
import { printFetchError } from '../helpers.js';

export async function getOpenidConfiguration(issuer: string): Promise<OpenidConfiguration> {
  return fetch(`${issuer}/${WELL_KNOWN.OPENID_CONFIGURATION}`)
    .then((res) => res.json())
    .catch((error) => {
      printFetchError(error);
    });
}