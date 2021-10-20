<img align="right" height=128 width=128 src="logo.png" /></p>

# Toast


## Contributing

Thanks for your interest in contributing to Toast! Before making any changes, [open an issue](https://github.com/Neesh774/Toast/issues) to make sure they're needed. Follow the project's [Code of Conduct](https://github.com/Neesh774/Toast/blob/main/CODE_OF_CONDUCT.md)!

### Setup

**Hosting Toast yourself is not supported.** The recommended way to use the bot is through the [official, public instance](https://discord.com/api/oauth2/authorize?client_id=784853298271748136&permissions=19456&scope=bot%20applications.commands). These instructions are meant for contributors.


1. Run `npm install` to install Toast's dependencies.
2. Copy `config.json.EXAMPLE` to `config.json` & change as necessary.
    - You'll probably want to add your bot's `token`, and add your own user Id to the `admins` array.
3. Run `node deployCommands.js <client Id> [guild Id]` to register slash commands.
    - Replace `<client Id>` with your bot's Id & replace `[guild Id]` with your development guild.
    - When deploying to production, omit `[guild Id]` to create global slash commands, rather than guild ones.
4. Run the bot with `node .`!

Before committing any changes, run `npm run lint:fix` to run ESLint & Prettier. Address any issues ESLint has.

## License

    Copyright (C) 2020-2021 Nicholas Christopher

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
