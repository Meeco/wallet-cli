export type CredentialMetadata = {
  credential_definition: {
    type?: string[];
    vct?: string;
  };
  display: Array<{ name: string }>;
  format: string;
  id: string;
  types?: string[];
};

export type Credential = {
  credentialIdentifier: string;
  format: string;
  id: string;
  name: string;
  types: string[];
};
