/**
 * @fileoverview Ping Command
 * @author Kars1996 (https://kars.bio)
 * @copyright Copyright 2025 Resynced Design
 * @github https://github.com/ResyncedDesign/GiveawayBot
 */

import {
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
} from "discord.js";
import { SlashCommand } from "../types";
import GuildManager from "../database/guildManager";

const guild = new GuildManager();

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check the bots ping"),
    execute: async (interaction) => {
        const embed = new EmbedBuilder()
            .setColor(await guild.fetchColor(interaction.guildId!))
            .setDescription(
                `>>> **Ping:** ${
                    interaction.client.ws.ping
                }ms\n **Uptime** ${Math.floor(
                    interaction.client.uptime / 1000 / 60
                )}m
                `
            );
        interaction.reply({
            embeds: [embed],
        });
    },
};
