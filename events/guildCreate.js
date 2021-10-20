/*
Copyright (C) 2020-2021 Nicholas Christopher

This file is part of Toast.

Toast is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, version 3.

Toast is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Toast.  If not, see <https://www.gnu.org/licenses/>.
*/

const { blockedGuilds } = require("../config.json");

module.exports = {
	name: "guildCreate",
	once: false,
	async execute(guild) {
		if (blockedGuilds?.includes?.(guild.id)) {
			guild.leave();
		}
	},
};
