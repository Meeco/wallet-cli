import { JWT_TYPE } from './openid/openid.types.js';

export function generateRandomCode(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

export function prependTS(filename: string) {
  return `${Math.floor(Date.now()/1000)}.${filename}`;
}

export async function printFetchError(res: Response, message = 'HTTP request failed!') {
  const body = await res.text();

  console.log(`==============================================`);
  console.log(message);
  console.log(`Status code: ${res.status}`);
  console.log(`Response: ${body}`);
}

export function isVcSdJwt({ format }: { format: string }) {
  return format === JWT_TYPE.VC_SD_JWT;
}