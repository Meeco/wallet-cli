## [1.4.3]

Refactored: changes for OID4VCI spec - draft 13

- `credentials_supported` &rarr; `credential_configurations_supported`
- `authorization_server` &rarr; `authorization_servers`
- `credentials` &rarr; `credential_configuration_ids`
- `user_pin` &rarr; `tx_code` object

## [1.4.2]

Refactored: `vct` and `claims` properties of `vc+sd-jwt`, previously nested within `credential_definition`, are now at the top level.

## [1.4.1]

Changed credential endpoint payload for `jwt_vc_json` to use `credential_definition.type` to support `organisation-wallet` version `0.0.13`

## [1.4.0]

Add [PAR - Pushed Authorization Request](https://www.rfc-editor.org/rfc/rfc9126.html) support

## [1.3.3]

Add better handling for present http errors
Simplify response on successful `present`

## [1.3.2]

add [-v --verbose] flags to `claim` - to print out credential to terminal
Add Support for `organisation-wallet` version `0.0.10`
Drop Support for `organisation-wallet` version `<=0.0.9`

## [1.3.1] (2023.12.18)

Add support to call `claim` and `present` commands with `--url` or `-u` flag to accept url from stdin

## [1.3.0] (2023.12.18)

new format of payload for `/credential` endpoint
Add error messages on failing to fetch credential-offer or claiming credential

## [1.2.1] (2023.12.15)

Bugfix: trim credential-offer and presentation-request input files

## [1.2.0] (2023.12.11)

Add support to get `token_endpoint` and `grant_types_supported` from `.well-known/openid-configuration`
Add [-f --file] flags to `present` and `claim` commands
Add support for `credential_definition` in `credentials_supported`

## [1.1.0] (2023.12.07)

Parse `credentials_supported` as map

## [1.0.0] (2023.12.01)

Initial Version
