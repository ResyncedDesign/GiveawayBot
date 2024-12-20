import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import GiveawayManager from "../database/gwManager";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("greroll")
        .setDescription("Reroll an Ended Giveaway")
        .addStringOption((option) =>
            option
                .setName("messageid")
                .setDescription("The message ID of the giveaway")
                .setRequired(true)
        ),
    execute: async (interaction) => {
        const giveawayId = interaction.options.getString("messageid");

        const gw = new GiveawayManager();
        const giveaway = gw.fetchGiveaway(giveawayId!);

        if (!giveaway) {
            return interaction.reply("Invalid giveaway ID");
        }

        if (giveaway.guildId !== interaction.guildId) {
            return interaction.reply("This giveaway is not in this guild");
        }

        if (giveaway.status === 1) {
            return interaction.reply("This giveaway is not ended yet");
        }

        const winners = gw.pickWinners(giveaway);

        if (winners.length === 0) {
            return interaction.reply("No one entered the giveaway");
        }

        const channel = interaction.guild!.channels.cache.get(
            giveaway.channelId
        ) as any;
        if (!channel) return interaction.reply("Channel not found");

        const winnersText = winners
            .map((winnerId) => `<@${winnerId}>`)
            .join(", ");

        await channel.send({
            content: `**New Winner(s)**: ${winnersText}`,
        });

        interaction.reply({
            content: "New Winners have been selected",
            ephemeral: true,
        });
    },
};

export default command;
