import mysql2 from 'mysql2';
import logger from '~/utils/logger';

export default class Database {
    private connection: mysql2.Connection;

    constructor() {
        this.connection = mysql2.createConnection({
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT || "3306"),
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME
        });

        this.connection.connect((err) => {
            if (err) {
                logger.error(`Failed to connect to database: ${err.message}`);
            } else {
                logger.success("Connected to database");
            }
        });
    }

    public async query(sql: string, values?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            logger.debug(`Executing query: ${sql} | [Values: ${values}]`);
            this.connection.query(sql, values, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    public close() {
        this.connection.end();
    }

    public async select(table: string, columns: string[] | string = "*", where: string = "", values: any[] = []): Promise<any> {
        let sql = `SELECT ${Array.isArray(columns) ? columns.join(", ") : columns} FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }

        return await this.query(sql, values);
    }

    public async insert(table: string, values: Record<string, any>): Promise<any> {
        const columns = Object.keys(values);
        const sql = `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`;

        return await this.query(sql, Object.values(values));
    }

    public async update(table: string, values: Record<string, any>, where: string, whereValues: any[]): Promise<any> {
        const columns = Object.keys(values);
        const sql = `UPDATE ${table} SET ${columns.map((column) => `${column} = ?`).join(", ")} WHERE ${where}`;

        return await this.query(sql, [...Object.values(values), ...whereValues]);
    }

    public async delete(table: string, where: string, values: any[]): Promise<any> {
        const sql = `DELETE FROM ${table} WHERE ${where}`;

        return await this.query(sql, values);
    }

    public async createTable(table: string, columns: Record<string, string>): Promise<any> {
        const cols = Object.keys(columns).map((column) => `${column} ${columns[column]}`);
        const sql = `CREATE TABLE IF NOT EXISTS ${table} (${cols.join(", ")})`;

        return await this.query(sql);
    }

    public async dropTable(table: string): Promise<any> {
        const sql = `DROP TABLE IF EXISTS ${table}`;

        return await this.query(sql);
    }

}