import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("greroll")
        .setDescription("Reroll an Ended Giveaway"),
    execute: (interaction) => {
        interaction.reply("Hello world");
    },
};

export default command;
