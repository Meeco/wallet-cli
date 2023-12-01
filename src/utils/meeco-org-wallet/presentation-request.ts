import { CREATE_PRESENTATION_REQUEST_ENDPOINT } from './constants.js';

export function createPresentationRequest(url: string, definitionId: string) {
  return fetch(`${url}${CREATE_PRESENTATION_REQUEST_ENDPOINT}`, {
    body: JSON.stringify({
      definitionId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
  .then((res) => res.json());
}