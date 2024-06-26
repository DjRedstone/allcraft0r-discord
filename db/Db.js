const mysql = require("mysql");
const { Snowflake } = require("discord.js");

/**
 * Check if two dates are the same day
 * @param {Date} d1
 * @param {Date} d2
 * @return {boolean}
 */
function sameDay(d1, d2) {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
}

class Db {
    DEFAULT_MONEY = 100;

    /**
     * Constructor
     * @param {Object} config - Configuration
     */
    constructor(config) {
        this.config = config;
        this.connected = false;
        this.connect().then(() => {
            console.info("✅ Connected to database!");
            this.connected = true;
        });
    }

    /**
     * Connect to database
     * @returns {Promise}
     */
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

    /**
     * Query database
     * @param {String} sql
     * @returns {Promise<Array>}
     */
    async query(sql) {
        return new Promise((resolve, reject) => {
            this.db.query(sql, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }

    /**
     * Get money from user by id
     * @param {Snowflake} userId
     * @returns {Promise<number>}
     */
    async getUserMoney(userId) {
        const rows = await this.query(`SELECT money FROM user_money WHERE uuid = ${userId};`);
        if (rows.length === 0) {
            const now = new Date();
            await this.query(`INSERT INTO user_money
                                    VALUES (${userId}, ${this.DEFAULT_MONEY},
                                    "${now.toLocaleString("lt-LT")}",
                                    "${now.toLocaleString("lt-LT")}")`);
            return await this.getUserMoney(userId);
        } else {
            return rows[0].money;
        }
    }

    /**
     * Set money of user by id
     * @param {Snowflake} userId
     * @param {number} money
     * @returns {Promise}
     */
    async setUserMoney(userId, money) {
        return await this.query(`UPDATE user_money SET money = ${money} WHERE uuid = ${userId}`);
    }

    /**
     * Check if user has daily today
     * @param {Snowflake} userId
     * @return {Promise<boolean>}
     */
    async hasDaily(userId) {
        const rows = await this.query(`SELECT last_daily FROM daily WHERE uuid = ${userId};`);
        if (rows.length === 0) {
            return false;
        } else {
            return sameDay(rows[0].last_daily, new Date());
        }
    }

    /**
     * Update daily of user by id
     * @param {Snowflake} userId
     * @return {Promise}
     */
    async updateDaily(userId) {
        const rows = await this.query(`SELECT last_daily FROM daily WHERE uuid = ${userId};`);
        if (rows.length === 0) {
            await this.query(`INSERT INTO daily VALUES(${userId}, "${new Date().toLocaleString("lt-LT")}");`);
        } else {
            await this.query(`UPDATE daily SET last_daily = "${new Date().toLocaleString("lt-LT")}" WHERE uuid = ${userId};`);
        }
    }

    /**
     * Get leaderboard of money
     * @returns {Promise<Array>}
     */
    async getLeaderboard() {
        return await this.query("SELECT uuid, money FROM user_money ORDER BY money DESC;");
    }

    /**
     * Get blacklisted words
     * @return {Promise<Array>}
     */
    async getBlacklistedWords() {
        return await this.query("SELECT * FROM blacklist ORDER BY datetime DESC;");
    }

    /**
     * Add a word to blacklisted words
     * @param word {String} The word
     * @param userId {Snowflake} The user who add the word
     * @return {Promise<void>}
     */
    async addBlacklistWord(word, userId) {
        await this.query(`INSERT INTO blacklist VALUES("${word}", ${userId}, "${new Date().toLocaleString("lt-LT")}");`);
    }

    /**
     * Remove a word from blacklisted words
     * @param word {String} The word
     * @return {Promise<boolean>} All happened good
     */
    async removeBlacklistedWord(word) {
        const res = await this.query(`SELECT word FROM blacklist WHERE word = "${word}";`);
        if (res.length === 0) return false;
        await this.query(`DELETE FROM blacklist WHERE word = "${word}";`);
        return true;
    }
}

module.exports = Db;