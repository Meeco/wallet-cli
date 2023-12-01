import { select } from '@inquirer/prompts';
import { Command } from '@oclif/core';
import { decodeJwt } from 'jose';
import { readFile, writeFile } from 'node:fs/promises';

import { listFilesAsInquirerChoice } from '../../utils/file.js';
import { prependTS } from '../../utils/index.js';
import { PresentationRequest } from '../../utils/openid/openid.types.js';
import { generatePresentationRequestSubmission, parsePresentationRequestURI } from '../../utils/openid/vp.js';

export default class Present extends Command {
  static args = {};

  static description = 'Present Credential from specified file as Verifiable Presentation; Currently only supports vc+sd-jwt as presentation';

  static examples = [
    `$ oex present`,
  ];

  async run(): Promise<void> {
    const requestFile = await select({
      choices: listFilesAsInquirerChoice(".data"),
      message: 'Select Presentation Request file'
    });

    const presentrationRequest = await readFile(requestFile, { encoding: 'utf8' }).then((data) => data.toString());
    const presentationRequestURI = parsePresentationRequestURI(presentrationRequest);

    const credentialFile = await select({
      choices: listFilesAsInquirerChoice('.data', /.jwt$/),
      message: 'Select Credential file'
    });
  
    const vc = await readFile(credentialFile, { encoding: 'utf8' }).then((data) => data.toString());

    const presentationRequestJWT = await fetch(presentationRequestURI).then((res) => res.text());
    const requestPayload = <PresentationRequest>decodeJwt(presentationRequestJWT);
    
    const requestSubmission = await generatePresentationRequestSubmission(requestPayload, vc);

    const submissionFile = prependTS('submission.json');
    this.log('Saving Presentation Request submission to', submissionFile);
    await writeFile(`./.data/${submissionFile}`, JSON.stringify(requestSubmission));
    
    const response = await fetch(requestPayload.redirect_uri, {
      body: JSON.stringify(requestSubmission),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    }).then((res) => res.json());
    
    const submissionResultFile = prependTS('submission-result.json');
    this.log('Saving Presentation Request submission Result to', submissionResultFile);
    writeFile(`./.data/${submissionResultFile}`, JSON.stringify(response));
  }
}