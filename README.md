oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g meeco-wallet-cli
$ meeco-wallet-cli COMMAND
running command...
$ meeco-wallet-cli (--version)
meeco-wallet-cli/0.0.0 darwin-arm64 node-v20.3.1
$ meeco-wallet-cli --help [COMMAND]
USAGE
  $ meeco-wallet-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`meeco-wallet-cli hello PERSON`](#meeco-wallet-cli-hello-person)
* [`meeco-wallet-cli hello world`](#meeco-wallet-cli-hello-world)
* [`meeco-wallet-cli help [COMMANDS]`](#meeco-wallet-cli-help-commands)
* [`meeco-wallet-cli plugins`](#meeco-wallet-cli-plugins)
* [`meeco-wallet-cli plugins:install PLUGIN...`](#meeco-wallet-cli-pluginsinstall-plugin)
* [`meeco-wallet-cli plugins:inspect PLUGIN...`](#meeco-wallet-cli-pluginsinspect-plugin)
* [`meeco-wallet-cli plugins:install PLUGIN...`](#meeco-wallet-cli-pluginsinstall-plugin-1)
* [`meeco-wallet-cli plugins:link PLUGIN`](#meeco-wallet-cli-pluginslink-plugin)
* [`meeco-wallet-cli plugins:uninstall PLUGIN...`](#meeco-wallet-cli-pluginsuninstall-plugin)
* [`meeco-wallet-cli plugins reset`](#meeco-wallet-cli-plugins-reset)
* [`meeco-wallet-cli plugins:uninstall PLUGIN...`](#meeco-wallet-cli-pluginsuninstall-plugin-1)
* [`meeco-wallet-cli plugins:uninstall PLUGIN...`](#meeco-wallet-cli-pluginsuninstall-plugin-2)
* [`meeco-wallet-cli plugins update`](#meeco-wallet-cli-plugins-update)

## `meeco-wallet-cli hello PERSON`

Say hello

```
USAGE
  $ meeco-wallet-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/meeco/meeco-wallet-cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `meeco-wallet-cli hello world`

Say hello world

```
USAGE
  $ meeco-wallet-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ meeco-wallet-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/meeco/meeco-wallet-cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `meeco-wallet-cli help [COMMANDS]`

Display help for meeco-wallet-cli.

```
USAGE
  $ meeco-wallet-cli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for meeco-wallet-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `meeco-wallet-cli plugins`

List installed plugins.

```
USAGE
  $ meeco-wallet-cli plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ meeco-wallet-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/index.ts)_

## `meeco-wallet-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ meeco-wallet-cli plugins add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ meeco-wallet-cli plugins add

EXAMPLES
  $ meeco-wallet-cli plugins add myplugin 

  $ meeco-wallet-cli plugins add https://github.com/someuser/someplugin

  $ meeco-wallet-cli plugins add someuser/someplugin
```

## `meeco-wallet-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ meeco-wallet-cli plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ meeco-wallet-cli plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/inspect.ts)_

## `meeco-wallet-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ meeco-wallet-cli plugins install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ meeco-wallet-cli plugins add

EXAMPLES
  $ meeco-wallet-cli plugins install myplugin 

  $ meeco-wallet-cli plugins install https://github.com/someuser/someplugin

  $ meeco-wallet-cli plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/install.ts)_

## `meeco-wallet-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ meeco-wallet-cli plugins link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ meeco-wallet-cli plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/link.ts)_

## `meeco-wallet-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ meeco-wallet-cli plugins remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ meeco-wallet-cli plugins unlink
  $ meeco-wallet-cli plugins remove

EXAMPLES
  $ meeco-wallet-cli plugins remove myplugin
```

## `meeco-wallet-cli plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ meeco-wallet-cli plugins reset
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/reset.ts)_

## `meeco-wallet-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ meeco-wallet-cli plugins uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ meeco-wallet-cli plugins unlink
  $ meeco-wallet-cli plugins remove

EXAMPLES
  $ meeco-wallet-cli plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/uninstall.ts)_

## `meeco-wallet-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ meeco-wallet-cli plugins unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ meeco-wallet-cli plugins unlink
  $ meeco-wallet-cli plugins remove

EXAMPLES
  $ meeco-wallet-cli plugins unlink myplugin
```

## `meeco-wallet-cli plugins update`

Update installed plugins.

```
USAGE
  $ meeco-wallet-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.8/src/commands/plugins/update.ts)_
<!-- commandsstop -->
