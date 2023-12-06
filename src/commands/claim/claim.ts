import { select } from '@inquirer/prompts';
import { Command } from '@oclif/core';
import { prompt } from '@oclif/core/lib/cli-ux/prompt.js';
import { readFile, writeFile } from 'node:fs/promises';

import { 
  claimCredentialOffer, 
  listFilesAsInquirerChoice, 
  parseCredentialOffer, 
  prependTS 
} from '../../utils/index.js';

export default class Claim extends Command {
  static args = {};

  static description = 'Claim Credential Offer from specified file';

  static examples = [
    `$ oex claim`,
  ];

  async run(): Promise<void> {
    const offerFile = await select({
      choices: listFilesAsInquirerChoice(".data"),
      message: 'Select Credential Offer file'
    });
  
    const credentialOffer = await readFile(offerFile).then((data) => data.toString());

    const credentialOfferURI = parseCredentialOffer(credentialOffer);

    const verifiableCredential = await claimCredentialOffer(credentialOfferURI);

    const vcFilename = await prompt('Save Credential as', { default: prependTS('credential.jwt') });

    await writeFile(`./.data/${vcFilename}`, verifiableCredential);
  }
}