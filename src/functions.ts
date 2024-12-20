import chalk from "chalk";
import {
    Client,
    GuildMember,
    PermissionFlagsBits,
    PermissionResolvable,
    TextChannel,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} from "discord.js";
import GiveawayManager from "./database/gwManager";
import GuildManager from "./database/guildManager";

type colorType = "text" | "variable" | "error";

const themeColors = {
    text: "#ff8e4d",
    variable: "#ff624d",
    error: "#f5426c",
};

export const getThemeColor = (color: colorType) =>
    Number(`0x${themeColors[color].substring(1)}`);

export const color = (color: colorType, message: any) => {
    return chalk.hex(themeColors[color])(message);
};

export const checkPermissions = (
    member: GuildMember,
    permissions: Array<PermissionResolvable>
) => {
    let neededPermissions: PermissionResolvable[] = [];
    permissions.forEach((permission) => {
        if (!member.permissions.has(permission))
            neededPermissions.push(permission);
    });
    if (neededPermissions.length === 0) return null;
    return neededPermissions.map((p) => {
        if (typeof p === "string") return p.split(/(?=[A-Z])/).join(" ");
        else
            return Object.keys(PermissionFlagsBits)
                .find((k) => Object(PermissionFlagsBits)[k] === p)
                ?.split(/(?=[A-Z])/)
                .join(" ");
    });
};

export const sendTimedMessage = (
    message: string,
    channel: TextChannel,
    duration: number
) => {
    channel
        .send(message)
        .then((m) =>
            setTimeout(
                async () => (await channel.messages.fetch(m)).delete(),
                duration
            )
        );
    return;
};

export function parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error("Invalid duration format");

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case "s":
            return value;
        case "m":
            return value * 60;
        case "h":
            return value * 60 * 60;
        case "d":
            return value * 60 * 60 * 24;
        default:
            throw new Error("Invalid duration unit");
    }
}

const giveawayManager = new GiveawayManager();
const guildManager = new GuildManager();
export async function processGiveaways(client: Client): Promise<void> {
    const endedGiveawayIds = giveawayManager.checkEnding();

    for (const giveawayId of endedGiveawayIds) {
        const giveaway = giveawayManager.fetchGiveaway(giveawayId);

        if (!giveaway) continue;

        const winners = giveawayManager.pickWinners(giveaway);

        giveawayManager.endGiveaway(parseInt(giveawayId));

        const channel = client.channels.cache.get(
            giveaway.channelId
        ) as TextChannel;
        if (channel && channel.isTextBased()) {
            const winnersText =
                winners.length > 0
                    ? winners.map((winnerId) => `<@${winnerId}>`).join(", ")
                    : "No valid entries, no winners could be chosen.";

            await channel.send({
                content: `🎉 **Giveaway Ended!** 🎉\n**Prize:** ${giveaway.prize}\n**Winners:** ${winnersText}\nHosted by: <@${giveaway.hostId}>`,
            });
        }

        for (const winnerId of winners) {
            const winner = await client.users.fetch(winnerId);
            if (winner) {
                await winner.send(
                    `🎉 **Congratulations!** 🎉\nYou won the giveaway for **${giveaway.prize}**! [Link](https://discord.com/channels/${channel.guildId}/${channel.id}/${giveaway.messageId})`
                );
            }
        }

        const message = await channel.messages.fetch(giveaway.messageId);
        if (message) {
            const button2 = new ButtonBuilder()
                .setEmoji(guildManager.fetchEmoji(giveaway.guildId))
                .setLabel(
                    JSON.parse(giveaway.entries || "[]").length.toString()
                )
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
                .setCustomId(`gw_${giveaway.messageId}`);
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                button2
            );

            const embed = new EmbedBuilder()
                .setColor(guildManager.fetchColor(giveaway.guildId))
                .setTitle(giveaway.prize)
                .setDescription(
                    `**Prize:** ${giveaway.prize}\n**Winners:** ${
                        winners.length > 0
                            ? winners
                                  .map((winnerId) => `<@${winnerId}>`)
                                  .join(", ")
                            : "No valid entries, no winners could be chosen."
                    }\nHosted by: <@${giveaway.hostId}>`
                );
            const content = `${guildManager.fetchEmoji(
                giveaway.guildId
            )} **GIVEAWAY ENDED** ${guildManager.fetchEmoji(
                giveaway.guildId
            )}\n${
                guildManager.fetchEveryonePing(giveaway.guildId)
                    ? "||@everyone||"
                    : ""
            }`;
            await message.edit({
                content: content,
                embeds: [embed],
                components: [row],
            });
        }
    }
}
