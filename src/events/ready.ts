import { Client } from "discord.js";
import { BotEvent } from "../types";
import { color, processGiveaways } from "../functions";

const event: BotEvent = {
    name: "ready",
    once: true,
    execute: (client: Client) => {
        console.log(
            color(
                "text",
                `🚀 Logged in as ${color("variable", client.user?.tag)}`
            )
        );

        setInterval(() => {
            processGiveaways(client);
        }, 1000);
    },
};

export default event;
