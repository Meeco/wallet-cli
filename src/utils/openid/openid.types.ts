export enum WELL_KNOWN {
  OPENID_CREDENTIAL_ISSUER = '.well-known/openid-credential-issuer'
}

export enum GRANT_TYPES {
  AUTHORIZATION_CODE = 'authorization_code',
  PREAUTHORIZED_CODE = 'urn:ietf:params:oauth:grant-type:pre-authorized_code'
}

export type SupportedCredential = {
  cryptographic_binding_methods_supported: string[];
  cryptographic_suites_supported: string[];
  display: [{
    name: string;
  }]
  format: string;
  id: string;
  types: string[];
}

export type IssuerMetadata = {
  [metadata: string]: unknown;
  authorization_endpoint?: string;
  credential_endpoint: string;
  credentials_supported: SupportedCredential[];
  grant_types_supported: string[];
  issuer: string;
  pushed_authorization_endpoint?: string;
  token_endpoint: string;
}

export enum SIGNING_ALG {
  ES256 = 'ES256'
}