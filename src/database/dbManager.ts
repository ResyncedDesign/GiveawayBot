import Database from "better-sqlite3";
import { Database as BetterSqlite3Database } from "better-sqlite3";

export default class DatabaseManager {
    private db: BetterSqlite3Database;
    private dbFilePath: string = "./src/database/data/database.db";

    /**
     * Initializes the database connection.
     * @param dbFilePath Path to the SQLite database file.
     */
    constructor() {
        this.db = new Database(this.dbFilePath);
        this.db.pragma("journal_mode = WAL");
    }

    /**
     * Validates table names and column names to prevent SQL injection.
     * Only allows alphanumeric characters and underscores.
     * @param identifier The table or column name to validate.
     * @returns `true` if the identifier is valid, otherwise throws an error.
     */
    private validateIdentifier(identifier: string): void {
        if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
            throw new Error(`Invalid identifier: ${identifier}`);
        }
    }

    /**
     * Runs a raw SQL query without returning results.
     * @param query SQL query to execute.
     * @param params Optional parameters for prepared statements.
     */
    protected runQuery(query: string, params: any[] = []): void {
        const statement = this.db.prepare(query);
        statement.run(...params);
    }

    /**
     * Executes a query and fetches a single row.
     * @param query SQL query string.
     * @param params Optional parameters for prepared statements.
     * @returns Result as a single row object.
     */
    protected getOne(query: string, params: any[] = []): any {
        const statement = this.db.prepare(query);
        return statement.get(...params);
    }

    /**
     * Executes a query and fetches all rows.
     * @param query SQL query string.
     * @param params Optional parameters for prepared statements.
     * @returns Array of rows.
     */
    protected getAll(query: string, params: any[] = []): any[] {
        const statement = this.db.prepare(query);
        return statement.all(...params);
    }

    /**
     * Creates a table in the database.
     * @param tableName Name of the table.
     * @param schema Schema definition for the table (e.g., "id INTEGER PRIMARY KEY, name TEXT").
     */
    protected createTable(tableName: string, schema: string): void {
        this.validateIdentifier(tableName);
        if (!/^[a-zA-Z0-9_(),\s]+$/.test(schema)) {
            throw new Error(`Invalid schema: ${schema}`);
        }

        const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${schema})`;
        this.runQuery(query);
    }

    /**
     * Drops a table from the database.
     * @param tableName Name of the table to drop.
     */
    protected dropTable(tableName: string): void {
        this.validateIdentifier(tableName);

        const query = `DROP TABLE IF EXISTS ${tableName}`;
        this.runQuery(query);
    }

    /**
     * Inserts a row into a table.
     * @param tableName Name of the table.
     * @param data Object containing column-value pairs to insert.
     */
    protected insert(tableName: string, data: Record<string, any>): void {
        this.validateIdentifier(tableName);

        const keys = Object.keys(data);
        keys.forEach((key) => this.validateIdentifier(key));

        const placeholders = keys.map(() => "?").join(", ");
        const values = Object.values(data);
        const query = `INSERT INTO ${tableName} (${keys.join(
            ", "
        )}) VALUES (${placeholders})`;

        this.runQuery(query, values);
    }

    /**
     * Closes the database connection.
     */
    public close(): void {
        this.db.close();
    }
}
