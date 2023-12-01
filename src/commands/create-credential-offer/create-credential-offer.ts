import { confirm } from '@inquirer/prompts';
import select from '@inquirer/select';
import { Args, Command } from '@oclif/core';
import { prompt } from '@oclif/core/lib/cli-ux/prompt.js';
import { readFile, writeFile } from 'node:fs/promises';

import { listJsonFilesChoices } from '../../utils/file.js';
import { getIssuerMetadata, parseGrantTypesAsChoices, prependTS } from '../../utils/index.js';
import { createCredentialOffer } from '../../utils/meeco-org-wallet/credential-offer.js';
import { GRANT_TYPES } from '../../utils/openid/openid.types.js';
import { Credential, CredentialMetadata } from './create-credential-offer.types.js';

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

    const supportedCredentialsChoices = issuerMetadata.credentials_supported.map(
      (credential: CredentialMetadata) => {
        const vc: Credential = {
          format: credential.format,
          id: credential.id,
          name: credential.display[0].name,
          types: credential.types,
        };
        
        return {
          description: `${vc.name} (${vc.format})`,
          name: `${vc.name} (${vc.format})`,
          value: vc,
        }
      }
    );

    const selectedGrantType = await select({
      choices: parseGrantTypesAsChoices(issuerMetadata.grant_types_supported),
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
    })
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
    })

    const offerFilename = await prompt('Save offer as', { default: prependTS('credential-offer.txt') });

    await writeFile(`./.data/${offerFilename}`, response.uri);
  }
}
