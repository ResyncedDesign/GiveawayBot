import {
    SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../types";
import GuildManager from "../database/guildManager";
const guild = new GuildManager()

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Edit the guild config"),
    execute: (interaction) => {
        interaction.reply("Hello world");
    },
};

export default command;
