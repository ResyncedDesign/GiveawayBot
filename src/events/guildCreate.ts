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
