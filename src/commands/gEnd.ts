import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("gend")
        .setDescription("End a giveaway early"),
    execute: (interaction) => {
        interaction.reply("Hello world");
    },
};

export default command;
