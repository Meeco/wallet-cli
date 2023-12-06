import { Args, Command } from '@oclif/core';
import { prompt } from '@oclif/core/lib/cli-ux/prompt.js';
import { writeFile } from 'node:fs/promises';

import { createPresentationRequest, prependTS } from '../../utils/index.js';

export default class CreatePresentationRequest extends Command {
  static args = {
    definitionId: Args.string({
      default: '3db41820-1e4c-4622-83d6-6cd3f0bc9f7c',
      description: 'SVX Presentation Definition ID',
      required: false
    }),
    url: Args.string({
      default: 'http://127.0.0.1:3000', 
      description: 'Meeco Organisation Wallet URL', 
      required: false
    }),
  };

  static description = 'Meeco Organisation Wallet - Create Presentation Request';

  static examples = [
    `$ oex create-presentation-offer 3db41820-1e4c-4622-83d6-6cd3f0bc9f7c http://127.0.0.1:3000`,
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(CreatePresentationRequest);

    const response = await createPresentationRequest(args.url, args.definitionId);

    const offerFilename = await prompt('Save Presentation Request URI as', { default: prependTS('presentation-request.txt') });

    await writeFile(`./.data/${offerFilename}`, decodeURIComponent(response.authRequestURI));
  }
}
