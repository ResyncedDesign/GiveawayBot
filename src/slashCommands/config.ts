import {
    SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("gconfig")
        .setDescription("Edit the guild config"),
    execute: (interaction) => {
        interaction.reply("Hello world");
    },
};

export default command;
