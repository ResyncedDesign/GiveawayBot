import {
    SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../types";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("gcreate")
        .setDescription("Create a giveaway"),
    execute: (interaction) => {
        interaction.reply("Hello world");
    },
};

export default command;
