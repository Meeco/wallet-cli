import { confirm } from '@inquirer/prompts';
import select from '@inquirer/select';
import { Args, Command } from '@oclif/core';
import { prompt } from '@oclif/core/lib/cli-ux/prompt.js';
import { readFile, writeFile } from 'node:fs/promises';

import { Credential } from '../../types/create-credential-offer.types.js';
import { GRANT_TYPES } from '../../types/index.js';
import { 
  createCredentialOffer, 
  getCredentialsSupportedAsChoices, 
  getIssuerMetadata, 
  listJsonFilesChoices, 
  parseGrantTypesAsChoices,
  prependTS,
} from '../../utils/index.js';
import { getOpenidConfiguration } from '../../utils/openid/openid-config.js';

export default class CreateCredentialOffer extends Command {
  static args = {
    url: Args.string({
      default: 'http://127.0.0.1:3000', 
      description: 'Meeco Organisation Wallet URL', 
      required: false
    }),
  };

  static description = 'Meeco Organisation Wallet - Create Credential Offer';

  static examples = [
    `$ oex create-credential-offer http://127.0.0.1:3000`,
    `? Select Grant Type Authorization Code
     ? Pin Required? yes
     ? Select Credential Student ID (vc+sd-jwt)
     ? Select Claims file claims.json`,
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(CreateCredentialOffer);

    const issuerMetadata = await getIssuerMetadata(args.url);

    const openidConfig = await getOpenidConfiguration(args.url);

    const supportedCredentialsChoices = getCredentialsSupportedAsChoices(issuerMetadata.credentials_supported);

    const supportedGrantTypes = parseGrantTypesAsChoices(issuerMetadata.grant_types_supported ?? openidConfig.grant_types_supported);

    const selectedGrantType = await select({
      choices: supportedGrantTypes,
      message: 'Select Grant Type'
    });

    let pinRequired = false;
    if (selectedGrantType === GRANT_TYPES.PREAUTHORIZED_CODE) {
      pinRequired = await confirm({ message: 'Pin Required?' });
    }

    const selectedCredential: Credential = await select({
      choices: supportedCredentialsChoices,
      message: 'Select Credential',
    });

    const claimsFile = await select({
      choices: listJsonFilesChoices(".data"),
      message: 'Select Claims file'
    });

    const claims = await readFile(claimsFile).then((data) => JSON.parse(data.toString()));
    
    const response = await createCredentialOffer({
      claims,
      format: selectedCredential.format,
      grantType: selectedGrantType,
      pinRequired,
      types: selectedCredential.types,
      url: args.url,
    }).catch((error) => {
      this.log('Failed to Create Credential offer:', error.message);
      this.exit(1);
    })

    const offerFilename = await prompt('Save offer as', { default: prependTS('credential-offer.txt') });

    await writeFile(`./.data/${offerFilename}`, decodeURIComponent(response.uri));

    if (response.userPin) {
      this.log('user PIN:', response.userPin);
    }
  }
}
