import DatabaseManager from "./dbManager";

export default class GuildManager extends DatabaseManager {
    private sql: string = `
        CREATE TABLE IF NOT EXISTS guilds (
            guildId BIGINT PRIMARY KEY,
            color TEXT DEFAULT "#ff8e4d",
            emoji TEXT DEFAULT "🎊"
        )
    `;

    constructor() {
        super();
        this.setup();
    }

    /**
     * Creates the guilds table if it does not already exist.
     */
    private setup(): void {
        this.runQuery(this.sql);
    }

    /**
     * Creates a new guild entry in the database.
     * @param guildId ID of the guild.
     * @param prefix Optional prefix for the guild (defaults to "!").
     * @param color Optional color for the guild (defaults to "#ff8e4d").
     */
    public createGuild(guildId: string, color: string = "#ff8e4d"): void {
        const query = `
      INSERT OR IGNORE INTO guilds (guildId, color)
      VALUES (?, ?)
    `;
        this.runQuery(query, [guildId, color]);
    }

    /**
     * Updates the color for a specific guild.
     * @param guildId ID of the guild.
     * @param newColor New color to set.
     */
    public updateColor(guildId: string, newColor: string): void {
        const query = `
      UPDATE guilds 
      SET color = ? 
      WHERE guildId = ?
    `;
        this.runQuery(query, [newColor, guildId]);
    }

    /**
     * Updates the emoji for a specific guild.
     * @param guildId ID of the guild.
     * @param newEmoji New emoji to set.
     */
    public updateEmoji(guildId: string, newEmoji: string): void {
        const query = `UPDATE guilds SET emoji = ? WHERE guildId = ?`;
        this.runQuery(query, [newEmoji, guildId]);
    }

    /**
     * Fetches the color for a specific guild.
     * @param guildId ID of the guild.
     * @returns Color as a string.
     */
    public fetchColor(guildId: string): string {
        const query = `SELECT color FROM guilds WHERE guildId = ?`;
        const result = this.getOne(query, [guildId]);

        if (result) {
            return result.color;
        } else {
            return "#ff8e4d";
        }
    }

    /**
     * Fetches the emoji for a specific guild.
     * @param guildId ID of the guild.
     * @returns Emoji as a string.
     */
    public fetchEmoji(guildId: string): string {
        const query = `SELECT emoji FROM guilds WHERE guildId = ?`;
        const result = this.getOne(query, [guildId]);

        if (result) {
            return result.emoji;
        } else {
            return "🎊";
        }
    }
}