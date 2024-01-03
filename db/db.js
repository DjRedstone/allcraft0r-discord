const mysql = require("mysql");
const {query} = require("express");

class DB {
    constructor(config) {
        this.config = config;
        this.connected = false;
        this.connect().then(() => {
            console.info("✅ Connected to database!");
            this.connected = true;
        });
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.db = mysql.createConnection(this.config);
            this.db.connect(err => {
                if (err) reject(err);
                else {
                    this.db.on("error", (err) => {
                        if (err.code === "PROTOCOL_CONNECTION_LOST") {
                            this.connect();
                        } else {
                            throw err;
                        }
                    });
                    resolve();
                }
            });
        });
    }

    async query(sql) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }

    async getLeaderboard() {
        return await this.query("SELECT uuid, money FROM user_money ORDER BY money DESC;");
    }
}

module.exports = DB;