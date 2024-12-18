import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import GuildManager from "../database/guildManager";

const guild = new GuildManager();

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("gconfig")
        .setDescription("Edit/View the guild config")
        .addBooleanOption((option) =>
            option.setName("everyone").setDescription("Toggle everyone ping")
        )
        .addStringOption((option) =>
            option
                .setName("color")
                .setDescription("Set the color of the guild eg. #ff0000")
        )
        .addStringOption((option) =>
            option
                .setName("emoji")
                .setDescription("Set the emoji of the guild eg. 🎊")
        ),
    execute: (interaction) => {
        const color = interaction.options.getString("color");
        const emoji = interaction.options.getString("emoji");
        const everyone = interaction.options.getBoolean("everyone");

        if (!color && !emoji && !everyone) {
            return interaction.reply({
                content: `Guild config:\n**Color:** ${guild.fetchColor(
                    interaction.guildId!
                )}\n**Emoji:** ${guild.fetchEmoji(
                    interaction.guildId!
                )}\n**Ping Everyone:** ${
                    guild.fetchEveryonePing(interaction.guildId!) == true
                        ? "yes"
                        : "no"
                }`,
            });
        }

        if (color) {
            if (!/^#[0-9A-F]{6}$/i.test(color)) {
                return interaction.reply("Invalid color code");
            }
            guild.updateColor(interaction.guildId!, color);
        }

        if (emoji) {
            guild.updateEmoji(interaction.guildId!, emoji);
        }

        if (everyone) {
            guild.updatePing(interaction.guildId!, everyone);
        }

        interaction.reply("Guild config updated");
    },
};

export default command;
