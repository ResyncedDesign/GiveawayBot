import {
    SlashCommandBuilder,
    EmbedBuilder,
    ChannelType,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} from "discord.js";
import { SlashCommand } from "../types";
import GuildManager from "../database/guildManager";
import GiveawayManager from "../database/gwManager";
import { parseDuration } from "../functions";

const guild = new GuildManager();
const giveaway = new GiveawayManager();

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("gcreate")
        .setDescription("Create a giveaway")
        .addStringOption((option) =>
            option
                .setName("prize")
                .setDescription("Set the prize")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("winners")
                .setDescription("Set the number of winners")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("duration")
                .setDescription("Set the duration")
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription("Set the channel")
                .setRequired(false)
        ),
    execute: async (interaction: any) => {
        const prize = interaction.options.getString("prize");
        const winners = interaction.options.getInteger("winners");
        const duration = interaction.options.getString("duration");
        const channel = interaction.options.getChannel("channel") as any;

        if (!prize || !winners || !duration) {
            return interaction.reply({
                text: "You forgot to fill out some fields",
                ephemeral: true,
            });
        }

        let parsedDuration: number;
        try {
            parsedDuration = parseDuration(duration);
        } catch (e) {
            return interaction.reply({
                text: "Invalid duration format. Use formats like `1h`, `30m`, or `2d`.",
                epheral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setColor(guild.fetchColor(interaction.guildId!))
            .setTitle(prize)
            .setDescription(
                `React with ${guild.fetchEmoji(
                    interaction.guildId!
                )} to enter\nDrawing in: <t:${
                    Math.floor(Date.now() / 1000) + parsedDuration
                }:R>\nHosted by: ${interaction.user}`
            )
            .setFooter({ text: `${winners} winner(s)` })
            .setTimestamp();

        if (channel) {
            if (
                channel.type === ChannelType.GuildText ||
                channel.type === ChannelType.GuildAnnouncement
            ) {
                const message = await channel.send({
                    embeds: [embed],
                    content: `${guild.fetchEmoji(
                        interaction.guildId!
                    )} **GIVEAWAY** ${guild.fetchEmoji(interaction.guildId!)} ${
                        guild.fetchEveryonePing(interaction.guildId!)
                            ? "\n||@everyone||"
                            : ""
                    }`,
                });

                const button = new ButtonBuilder()
                    .setEmoji(guild.fetchEmoji(interaction.guildId!))
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`gw_${message.id}`);

                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    button
                );
                await message.edit({ components: [row] });

                giveaway.createGiveaway({
                    channelId: channel.id,
                    duration: parsedDuration,
                    winners: winners,
                    prize: prize,
                    entries: "[]",
                    messageId: message.id,
                    hostId: interaction.user.id,
                    guildId: interaction.guildId!,
                });

                return interaction.reply({
                    text: `Giveaway started in ${channel}`,
                    ephemeral: true,
                });
            } else {
                return interaction.reply({
                    text: "The selected channel is not a text-based channel.",
                    ephemeral: true,
                });
            }
        } else {
            if (interaction.guild) {
                const message = await interaction.channel!.send({
                    embeds: [embed],
                    content: `${guild.fetchEmoji(
                        interaction.guildId!
                    )} **GIVEAWAY** ${guild.fetchEmoji(interaction.guildId!)} ${
                        guild.fetchEveryonePing(interaction.guildId!)
                            ? "\n||@everyone||"
                            : ""
                    }`,
                });

                const button = new ButtonBuilder()
                    .setEmoji(guild.fetchEmoji(interaction.guildId!))
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`gw_${message.id}`);

                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    button
                );
                await message.edit({ components: [row] });

                giveaway.createGiveaway({
                    channelId: interaction.channel!.id,
                    duration: parsedDuration,
                    winners: winners,
                    prize: prize,
                    entries: "[]",
                    messageId: message.id,
                    hostId: interaction.user.id,
                    guildId: interaction.guildId!,
                });

                return interaction.reply({
                    text: `Giveaway started in ${interaction.channel}`,
                    ephemeral: true,
                });
            }
        }
    },
};

export default command;
