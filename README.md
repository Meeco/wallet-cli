meeco-wallet-cli
=================

<!-- toc -->
* [Configuration](#configuration)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

<!-- config -->
# Configuration

## Holder Details
```
  # config/holder.json
  uri: # Holder identifier to be attached to the credential / presentation
  jwk: # private secp256r1 Key as JWK

```
<!-- configstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install
$ chmod +x ./bin/run.js
$ ./bin/run.js COMMAND
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`./bin/run.js claim`](#meeco-wallet-cli-claim)
* [`./bin/run.js present`](#meeco-wallet-cli-present)
* [`./bin/run.js create-credential-offer`](#meeco-wallet-cli-create-credential-offer)
* [`./bin/run.js create-presentation-request`](#meeco-wallet-cli-create-presentation-request)

## `meeco-wallet-cli claim`

Claim Credential Offer

```
USAGE
  $ ./bin/run.js claim

DESCRIPTION
  Issue a credential by claiming the provided Credential Offer.
  Will prompt to select a file containing Credential Offer URI.
  Will prompt for a filename to save the issued Credential (JWT).

EXAMPLE FILE
  (.data/credential-offer.txt)
  openid-credential-offer://?credential_offer_uri=http://127.0.0.1:3000/credential_offers/LG7GCAnpMv4uzcJkNbeyP2
```

## `meeco-wallet-cli present`

Generate a Presentation Request based on the Provided Presentation Request URI and selected Credential.
Currently only support `vc+sd-jwt` a presentation.

```
USAGE
  $ ./bin/run.js present

DESCRIPTION
  Generate a Presentation Request based on the Provided Presentation Request URI and selected Credential.
  Will prompt to select a file containing Presentation Request URI.
  Will prompt to select a JWT file containing the credential.
  Will prompt for a filename to save the generated submission.
  Will prompt for a filename to save the submission result.
  
EXAMPLE FILES
  (#presentation-offer.txt)
  openid-vc://?request_uri=https://api-dev.svx.exchange/oidc/presentations/requests/295fadc5-5843-46bd-bd5e-e36d7f4f1605/jwt

  (#credential.jwt)
  eyJhbGciOiJFZERTQSIsIm...
```

# Meeco Organisation Wallet

## `meeco-wallet-cli create-credential-offer`

Create Credential Offer

```
USAGE
  $ ./bin/run.js create-credential-offer [URL]

ARGUMENTS
  URL  Running instance of meeco-organisation-wallet. Default: `http://127.0.0.1:3000`

DESCRIPTION
  Create a credential offer.
  Will prompt for Grant Types, if Pin is Required, Credential Type + Format
  Will prompt for a file containing the claims

EXAMPLE FILE
  (#haip-credential-claims.json)
  {
    "given_name": "John",
    "last_name": "Doe"
  }
```

## `meeco-wallet-cli create-presentation-request`

Create Presentation Request

```
USAGE
  $ ./bin/run.js create-credential-offer [DEFINITION_ID] [URL]

ARGUMENTS
  DEFINITION_ID  SVX presentation id. 
                 Default: `3db41820-1e4c-4622-83d6-6cd3f0bc9f7c`.
                          a presentation requestion a student ID VC
  URL            Running instance of meeco-organisation-wallet. Default: `http://127.0.0.1:3000`

DESCRIPTION
  Create a Presentation Request.
  Will prompt for a filename to save the created Presentation Request URI.
```