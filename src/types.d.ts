import {
    SlashCommandOptionsOnlyBuilder,
    CommandInteraction,
    Collection,
    PermissionResolvable,
    Message,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
} from "discord.js";

export interface SlashCommand {
    command: SlashCommandOptionsOnlyBuilder;
    execute: (interaction: ChatInputCommandInteraction) => void;
    autocomplete?: (interaction: AutocompleteInteraction) => void;
    modal?: (interaction: ModalSubmitInteraction<CacheType>) => void;
    cooldown?: number;
}

interface GuildOptions {
    prefix: string;
}

export type GuildOption = keyof GuildOptions;
export interface BotEvent {
    name: string;
    once?: boolean | false;
    execute: (...args) => void;
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            CLIENT_ID: string;
        }
    }
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>;
        cooldowns: Collection<string, number>;
    }
}
