## [1.3.1] (2023.12.18)

Add support to call `claim` and `present` commands with `--url` or `-u` flag to accept url from stdin

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
