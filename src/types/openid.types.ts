import { JWK } from 'jose';

export enum WELL_KNOWN {
  OPENID_CONFIGURATION = '.well-known/openid-configuration',
  OPENID_CREDENTIAL_ISSUER = '.well-known/openid-credential-issuer',
}

export enum GRANT_TYPES {
  AUTHORIZATION_CODE = 'authorization_code',
  PREAUTHORIZED_CODE = 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
}

export type SupportedCredential = {
  credential_definition: {
    type?: string[];
  };
  cryptographic_binding_methods_supported: string[];
  cryptographic_suites_supported: string[];
  display: [
    {
      name: string;
    },
  ];
  format: string;
  id: string;
  vct?: string;
};

export type SupportedCredentialMap = {
  [identifier: string]: SupportedCredential;
};

export type CredentialOfferDetails = string[];

export type IssuerMetadata = {
  [metadata: string]: unknown;
  credential_configurations_supported: SupportedCredential[] | SupportedCredentialMap;
  credential_endpoint: string;
  issuer: string;
};

export type OpenidConfiguration = {
  authorization_endpoint: string;
  grant_types_supported: string[];
  issuer: string;
  jwks_uri: string;
  pushed_authorization_request_endpoint?: string;
  token_endpoint: string;
};

export enum SIGNING_ALG {
  ES256 = 'ES256',
}

export enum JWT_TYPE {
  JWT = 'JWT',
  KEY_BINDING_JWT = 'kb+jwt',
  VC_SD_JWT = 'vc+sd-jwt',
}

export enum SIOP {
  V2 = 'https://self-issued.me/v2/openid-vc',
}

export type PresentationRequest = {
  claims?: {
    vp_token?: {
      presentation_definition?: {
        [prop: string]: unknown;
        id: string;
        input_descriptors: Array<{
          constraints: Array<{
            [prop: string]: unknown;
          }>;
          id: string;
        }>;
      };
    };
  };
  exp: number;
  iss: string;
  nonce: number;
  redirect_uri: string;
  state: string;
};

export type IdTokenPayload = {
  _vp_token: object;
  aud: string;
  exp: number;
  nonce: number;
  sub: string;
  sub_jwk: JWK;
};
