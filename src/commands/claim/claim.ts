import { select } from '@inquirer/prompts';
import { Command, Flags } from '@oclif/core';
import { prompt } from '@oclif/core/lib/cli-ux/prompt.js';
import { readFile, writeFile } from 'node:fs/promises';

import { DATA_FOLDER } from '../../utils/constants.js';
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
    `$ oex claim --file <credential-offer.txt>`,
  ];

  static flags = {
    file: Flags.string({ 
      char: 'f',
      description: `credential offer filename in "${DATA_FOLDER}" folder`
    })
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Claim);

    let offerFile;

    if (flags.file) {
      offerFile = `${DATA_FOLDER}/${flags.file}`
    }

    if (!offerFile) {
      offerFile = await select({
        choices: listFilesAsInquirerChoice(DATA_FOLDER),
        message: 'Select Credential Offer file'
      });
    }
  
    const credentialOffer = await readFile(offerFile).then((data) => data.toString());

    const credentialOfferURI = parseCredentialOffer(credentialOffer);

    const verifiableCredential = await claimCredentialOffer(credentialOfferURI);

    const vcFilename = await prompt('Save Credential as', { default: prependTS('credential.jwt') });

    await writeFile(`${DATA_FOLDER}/${vcFilename}`, verifiableCredential);
  }
}