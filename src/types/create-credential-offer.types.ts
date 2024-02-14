export type CredentialMetadata = {
  credential_definition: {
    type?: string[];
  };
  display: Array<{ name: string }>;
  format: string;
  id: string;
  types?: string[];
  vct?: string;
};

export type Credential = {
  credentialIdentifier: string;
  format: string;
  id: string;
  name: string;
  types: string[];
};
