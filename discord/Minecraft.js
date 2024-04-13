const { Snowflake } = require("discord.js");

class MinecraftManager {
    constructor(client, db) {
        this.client = client;
        this.db = db;
    }

    /**
     * Get user data
     * @param userId {Snowflake} The user id
     * @return {Promise<{lvl: Number, xp: Number, rank: String, team: (Number|null)}>}
     */
    async getUserData(userId) {
        return await this.db.getUserData(userId);
    }
}

module.exports = MinecraftManager;