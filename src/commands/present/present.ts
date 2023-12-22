import { select } from '@inquirer/prompts';
import { Command, Flags, ux } from '@oclif/core';
import { decodeJwt } from 'jose';
import { readFile, writeFile } from 'node:fs/promises';

import type { PresentationRequest } from '../../types/index.js';

import { DATA_FOLDER } from '../../utils/constants.js';
import {
  generatePresentationRequestSubmission,
  listFilesAsInquirerChoice,
  parseFetchResponse,
  parsePresentationRequestURI,
  prependTS,
} from '../../utils/index.js';

export default class Present extends Command {
  static args = {};

  static description =
    'Present Credential from specified file as Verifiable Presentation; Currently only supports vc+sd-jwt as presentation';

  static examples = [
    `$ oex present`,
    `$ oex present --file <presentation-request.txt>`,
    `$ oex present --url <presentation-request-url>`,
  ];

  static flags = {
    file: Flags.string({
      char: 'f',
      description: `presentation request filename in "${DATA_FOLDER}" folder`,
    }),
    url: Flags.string({
      char: 'u',
      description: 'direct URL for the credential offer',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Present);

    let presentationRequestURI;

    if (flags.url) {
      presentationRequestURI = parsePresentationRequestURI(flags.url);
    } else if (flags.file) {
      const requestFile = `${DATA_FOLDER}/${flags.file}`;
      const presentrationRequest = await readFile(requestFile).then((data) => data.toString());
      presentationRequestURI = parsePresentationRequestURI(presentrationRequest);
    } else {
      const requestFile = await select({
        choices: listFilesAsInquirerChoice(DATA_FOLDER),
        message: 'Select Presentation Request file',
      });
      const presentrationRequest = await readFile(requestFile, { encoding: 'utf8' }).then((data) => data.toString());
      presentationRequestURI = parsePresentationRequestURI(presentrationRequest);
    }

    const credentialFile = await select({
      choices: listFilesAsInquirerChoice(DATA_FOLDER, /.jwt$/),
      message: 'Select Credential file',
    });

    const vc = await readFile(credentialFile, { encoding: 'utf8' }).then((data) => data.toString());

    ux.action.start('fetching presentation request JWT');

    const presentationRequestJWT = await fetch(presentationRequestURI).then((res) => res.text());
    const requestPayload = <PresentationRequest>decodeJwt(presentationRequestJWT);

    ux.action.stop();

    ux.action.start('generate presentation request submission');

    const requestSubmission = await generatePresentationRequestSubmission(requestPayload, vc);

    ux.action.stop();

    const submissionFile = prependTS('submission.json');
    this.log('Saving Presentation Request submission to', submissionFile);
    await writeFile(`${DATA_FOLDER}/${submissionFile}`, JSON.stringify(requestSubmission));
    
    await fetch(requestPayload.redirect_uri, {
      body: JSON.stringify(requestSubmission),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    })
    .then((res) => parseFetchResponse(res))
    .then((response) => {
      this.log('Presentation request completed');
      this.log('Response:', response);
    });

  }
}
