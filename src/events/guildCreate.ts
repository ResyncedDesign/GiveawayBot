/**
 * @fileoverview Guild Joining Event
 * @author Kars1996 (https://kars.bio)
 * @copyright Copyright 2024 Resynced Design
 * @github https://github.com/ResyncedDesign/GiveawayBot
 */

import { Guild } from "discord.js";
import { BotEvent } from "../types";
import { color } from "../functions";
import GuildManager from "../database/guildManager";

const database = new GuildManager();

const event: BotEvent = {
    name: "guildCreate",
    execute: (guild: Guild) => {
        database.createGuild(guild.id);
        console.log(
            color(
                "text",
                `🌠 Successfully created guild ${color("variable", guild.name)}`
            )
        );
    },
};

export default event;
