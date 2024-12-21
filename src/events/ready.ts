/**
 * @fileoverview Ready Event
 * @author Kars1996 (https://kars.bio)
 * @copyright Copyright 2024 Resynced Design
 * @github https://github.com/ResyncedDesign/GiveawayBot
 */

import { ActivityType, Client } from "discord.js";
import { BotEvent } from "../types";
import { color, processGiveaways } from "../functions";

const event: BotEvent = {
    name: "ready",
    once: true,
    execute: (client: Client) => {
        console.log(
            color(
                "text",
                `\n🚀 Logged in as ${color("variable", client.user?.tag)}`
            )
        );

        client.user?.setActivity({
            name: "🎉 Resynced Giveaways",
            type: ActivityType.Custom,
        });

        setInterval(() => {
            processGiveaways(client);
        }, 1000);
    },
};

export default event;
