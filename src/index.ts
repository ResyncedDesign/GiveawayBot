import { Client, GatewayIntentBits, Collection } from "discord.js";

const { Guilds, MessageContent, GuildMessages, GuildMembers } =
    GatewayIntentBits;
const client = new Client({
    intents: [Guilds, MessageContent, GuildMessages, GuildMembers],
});
import { SlashCommand } from "./types";
import { config } from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { color } from "./functions";
import Figlet from "figlet";

config();

console.log(
    color(
        "text",
        Figlet.textSync(`Resynced`, {
            font: "Doom",
            width: 60,
            whitespaceBreak: true,
        })
    )
);

console.log(
    color("text", `❤  With love from ${color("variable", "Resynced Design")}\n`)
);

client.slashCommands = new Collection<string, SlashCommand>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach((handler) => {
    if (!handler.endsWith(".js")) return;
    require(`${handlersDir}/${handler}`)(client);
});

client.login(process.env.TOKEN);
