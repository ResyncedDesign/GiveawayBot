/**
 * @fileoverview Giveaway End Command
 * @author Kars1996 (https://kars.bio)
 * @copyright Copyright 2024 Resynced Design
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
import GiveawayManager from "../database/gwManager";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("gend")
        .setDescription("End a giveaway early")
        .addStringOption((option) =>
            option
                .setName("messageid")
                .setDescription("The message ID of the giveaway")
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName("selectwinners")
                .setDescription("Whether to select winners or not")
                .setRequired(false)
        ),
    execute: async (interaction) => {
        const giveawayId = interaction.options.getString("messageid");
        const selectWinners =
            interaction.options.getBoolean("selectwinners") || false;

        const gw = new GiveawayManager();
        const guild = new GuildManager();

        const giveaway = gw.fetchGiveaway(giveawayId!);

        if (!giveaway) {
            return interaction.reply("Invalid giveaway ID");
        }

        if (giveaway.guildId !== interaction.guildId) {
            return interaction.reply("This giveaway is not in this guild");
        }

        const winners = gw.pickWinners(giveaway);
        gw.endGiveaway(giveaway.id!.toString());
        const channel = interaction.guild!.channels.cache.get(
            giveaway.channelId
        ) as any;
        if (!channel) return interaction.reply("Channel not found");

        const message = await channel.messages.fetch(giveaway.messageId);
        if (!message) return interaction.reply("Message not found");

        const content = `${guild.fetchEmoji(
            interaction.guildId!
        )} **GIVEAWAY ENDED** ${guild.fetchEmoji(interaction.guildId!)}`;

        const button = new ButtonBuilder()
            .setEmoji(guild.fetchEmoji(interaction.guildId!))
            .setLabel(JSON.parse(giveaway.entries || "[]").length.toString())
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)
            .setCustomId(`gw_${giveaway.messageId}`);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        const embed = new EmbedBuilder()
            .setColor(guild.fetchColor(interaction.guildId!))
            .setTitle(giveaway.prize)
            .setDescription(
                `**Prize:** ${giveaway.prize}${
                    selectWinners
                        ? `\n**Winners:** ${
                              winners.length > 0
                                  ? winners
                                        .map((winnerId) => `<@${winnerId}>`)
                                        .join(", ")
                                  : "No valid entries, no winners could be chosen."
                          }`
                        : ""
                }\nHosted by: <@${giveaway.hostId}>`
            );

        await message.edit({
            components: [row],
            embeds: [embed],
            content: content,
        });
        if (winners.length > 0 && selectWinners) {
            if (channel?.type == ChannelType.GuildText) {
                const winnersText = winners
                    .map((winnerId) => `<@${winnerId}>`)
                    .join(", ");

                channel.send({
                    content: `🎉 **Giveaway Ended!** 🎉\n**Prize:** ${giveaway.prize}\n**Winners:** ${winnersText}\nHosted by: <@${giveaway.hostId}>`,
                });

                for (const winnerId of winners) {
                    const winner =
                        interaction.guild!.members.cache.get(winnerId);

                    if (winner) {
                        winner
                            .send(
                                `🎉 **Congratulations!** 🎉\nYou won the giveaway for **${giveaway.prize}**! [Link](https://discord.com/channels/${channel.guildId}/${channel.id}/${giveaway.messageId})`
                            )
                            .catch((e) => e);
                    }
                }
            }
        }

        interaction.reply("Ended giveaway successfully");
    },
};

export default command;
