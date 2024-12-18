import DatabaseManager from "./dbManager";

export interface Giveaway {
    id?: number;
    channelId: string;
    duration: number; // Duration in seconds
    winners: number;
    prize: string;
    entries: string;
    createdAt?: string;
    messageId: string;
    hostId: string;
    guildId: string;
    status?: boolean; // true = active, false = ended
}

export default class GiveawayManager extends DatabaseManager {
    private sql: string = `
    CREATE TABLE IF NOT EXISTS giveaways (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channelId TEXT NOT NULL,
        duration INTEGER NOT NULL,
        winners INTEGER NOT NULL,
        prize TEXT NOT NULL,
        entries TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        messageId TEXT,
        hostId TEXT NOT NULL,
        guildId TEXT NOT NULL,
        status BOOLEAN DEFAULT 1
    )
  `;

    constructor() {
        super();
        this.setup();
    }

    /**
     * Initializes the giveaways table.
     */
    private setup(): void {
        this.runQuery(this.sql);
    }

    /**
     * Creates a new giveaway entry in the database.
     * @param giveaway Giveaway details.
     */
    public createGiveaway(giveaway: Giveaway): void {
        const query = `
      INSERT INTO giveaways (
        channelId, duration, winners, prize, entries, messageId, hostId, guildId
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        this.runQuery(query, [
            giveaway.channelId,
            giveaway.duration,
            giveaway.winners,
            giveaway.prize,
            giveaway.entries || "[]",
            giveaway.messageId,
            giveaway.hostId,
            giveaway.guildId,
        ]);
        return;
    }

    /**
     * Ends a giveaway by updating its status.
     * @param giveawayId ID of the giveaway to end.
     */
    public endGiveaway(giveawayId: number): void {
        const query = `
      UPDATE giveaways
      SET status = 0
      WHERE id = ?
    `;
        this.runQuery(query, [giveawayId]);
    }

    /**
     * Fetches all active giveaways.
     * @returns Array of active giveaways.
     */
    public fetchActive(): Giveaway[] {
        const query = `
      SELECT * FROM giveaways
      WHERE status = 1
    `;
        const results = this.getAll(query);
        return results as Giveaway[];
    }

    /**
     * Fetch giveaway from ID.
     * @param giveawayId ID of the giveaway to fetch
     * @returns Giveaway
     */
    public fetchGiveaway(gId: string): Giveaway {
        const query = `
      SELECT * FROM giveaways
      WHERE id = ?
    `;
        const result = this.getOne(query, [gId]);
        if (!result) {
            const sql2 = `
            SELECT * FROM giveaways WHERE messageId = ?`;
            const result2 = this.getOne(sql2, [gId]);
            return result2 as Giveaway;
        }
        return result as Giveaway;
    }

    /**
     * Checks for giveaways that should end based on their duration and createdAt timestamp.
     * Ends giveaways that have surpassed their duration.
     */
    public checkEnding(): string[] {
        const activeGiveaways = this.fetchActive();
        const now = new Date().getTime();

        const arr: string[] = [];
        activeGiveaways.forEach((giveaway) => {
            const createdAt = new Date(giveaway.createdAt || "").getTime();
            const endTime = createdAt + giveaway.duration * 1000;
            if (now >= endTime) {
                arr.push(giveaway.id!.toString());
            }
        });
        return arr;
    }

    /**
     * Picks random winners for a giveaway.
     * @param giveaway Giveaway object.
     */
    public pickWinners(giveaway: Giveaway): string[] {
        const entries = JSON.parse(giveaway.entries) as string[];
        const winners: string[] = [];

        if (entries.length === 0) {
            return [];
        }

        for (let i = 0; i < giveaway.winners; i++) {
            if (entries.length === 0) break;
            const randomIndex = Math.floor(Math.random() * entries.length);
            winners.push(entries.splice(randomIndex, 1)[0]);
        }

        return winners;
    }

    /**
     * Adds an entry to the giveaway.
     * @param giveawayId ID of the giveaway.
     * @param userId ID of the user entering the giveaway.
     */
    public addEntry(giveawayId: number, userId: string): boolean {
        const query = `
      SELECT entries FROM giveaways
      WHERE id = ?
    `;
        const result = this.getOne(query, [giveawayId]);

        if (!result) {
            return false;
        }

        const entries = JSON.parse(result.entries) as string[];
        if (entries.includes(userId)) {
            return false;
        }

        entries.push(userId);
        const updateQuery = `
      UPDATE giveaways
      SET entries = ?
      WHERE id = ?
    `;
        this.runQuery(updateQuery, [JSON.stringify(entries), giveawayId]);
        return true;
    }
}
