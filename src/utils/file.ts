import { readdirSync } from 'node:fs';

export function listFiles(path: string) {
  return readdirSync(path, { withFileTypes: true })
    .filter((entry) => !entry.isDirectory())
    .map((entry) => entry.name);
}

export function listFilesAsInquirerChoice(path: string, regex: RegExp = /./ ) {
  return listFiles(path)
    .filter((filename) => filename.match(regex))
    .map((filename) => ({
      name: filename,
      value: `${path}/${filename}`
    }));
}

export function listJsonFilesChoices(path: string) {
  return listFilesAsInquirerChoice(path, /.json$/);
}