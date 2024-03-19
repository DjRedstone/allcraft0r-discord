const { Snowflake } = require("discord.js");

class MoneyManager {
    constructor(client, db) {
        this.client = client;
        this.db = db;
    }

    /**
     * Log to discord
     * @param {String} text
     */
    log(text) {
        global.discord.logChannel.send({
            content: "```diff\n" + text + "\n```"
        });
    }

    /**
     * Get money from user by id
     * @param {Snowflake} userId
     * @returns {Promise<number>}
     */
    async get(userId) {
        return await this.db.getUserMoney(userId);
    }

    /**
     * Add money to user by id
     * @param {Snowflake} userId
     * @param {number} money
     */
    async add(userId, money) {
        const current = await this.get(userId);
        await this.db.setUserMoney(userId, current + money);
        this.log(`+ ${this.client.users.cache.get(userId).username} | ${current} + ${money} = ${current + money}`);
    }

    /**
     * Remove money from user by id
     * @param {Snowflake} userId
     * @param {number} money
     * @returns {Promise}
     */
    async remove(userId, money) {
        const current = await this.get(userId);
        await this.db.setUserMoney(userId, current - money);
        this.log(`- ${this.client.users.cache.get(userId).username} | ${current} - ${money} = ${current + money}`);
    }

}

module.exports = MoneyManager;