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

    /**
     * Get user ores
     * @param userId {Snowflake} The user id
     * @return {Promise<{gold: Number | null, diamond: Number | null, dirt: Number, coal: Number | null, iron: Number | null, quartz: Number | null, lapis: Number | null, redstone: Number | null, emerald: Number | null, stone: Number, netherite: Number | null}>}
     */
    async getUserOres(userId) {
        return await this.db.getUserOres(userId);
    }

    /**
     * List all the maps
     * @return {Promise<Array>}
     */
    async getMaps() {
        return await this.db.getMaps();
    }

    /**
     * Get data from a map
     * @param mapId {Number} The map id
     * @return {Promise<{name: String, description: String, difficulty: String, required_lvl: Number, gold: Number | null, diamond: Number | null, dirt: Number, coal: Number | null, iron: Number | null, quartz: Number | null, lapis: Number | null, redstone: Number | null, emerald: Number | null, stone: Number, netherite: Number | null} | null>}
     */
    async getMap(mapId) {
        return await this.db.getMap(mapId);
    }
}

module.exports = MinecraftManager;