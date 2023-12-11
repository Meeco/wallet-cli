import { select } from '@inquirer/prompts';
import { Command, Flags, ux } from '@oclif/core';
import { decodeJwt } from 'jose';
import { readFile, writeFile } from 'node:fs/promises';

import type { PresentationRequest } from '../../types/index.js';

import { DATA_FOLDER } from '../../utils/constants.js';
import { 
  generatePresentationRequestSubmission, 
  listFilesAsInquirerChoice, 
  parsePresentationRequestURI, 
  prependTS,
} from '../../utils/index.js';

export default class Present extends Command {
  static args = {};

  static description = 'Present Credential from specified file as Verifiable Presentation; Currently only supports vc+sd-jwt as presentation';

  static examples = [
    `$ oex present`,
  ];

  static flags = {
    file: Flags.string({ 
      char: 'f',
      description: `presentation request filename in "${DATA_FOLDER}" folder`
    })
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Present);

    let requestFile;

    if (flags.file) {
      requestFile = `${DATA_FOLDER}/${flags.file}`
    }

    if (!requestFile) {
      requestFile = await select({
        choices: listFilesAsInquirerChoice(DATA_FOLDER),
        message: 'Select Presentation Request file'
      });
    }

    const presentrationRequest = await readFile(requestFile, { encoding: 'utf8' }).then((data) => data.toString());
    const presentationRequestURI = parsePresentationRequestURI(presentrationRequest);

    const credentialFile = await select({
      choices: listFilesAsInquirerChoice(DATA_FOLDER, /.jwt$/),
      message: 'Select Credential file'
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
    
    const response = await fetch(requestPayload.redirect_uri, {
      body: JSON.stringify(requestSubmission),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    }).then((res) => res.json());
    
    const submissionResultFile = prependTS('submission-result.json');
    this.log('Saving Presentation Request submission Result to', submissionResultFile);
    writeFile(`${DATA_FOLDER}/${submissionResultFile}`, JSON.stringify(response));
  }
}