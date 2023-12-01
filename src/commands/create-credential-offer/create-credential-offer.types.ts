export type CredentialMetadata = {
  display: Array<{ name: string }>;
  format: string;
  id: string;
  types: string[];
}

export type Credential = {
  format: string;
  id: string;
  name: string;
  types: string[];
}
