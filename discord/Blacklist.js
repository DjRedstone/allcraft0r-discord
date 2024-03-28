const { Snowflake } = require("discord.js");

/**
 * Return all chars of a string
 * @param s {String} The string
 * @return {Set<String>} The chars
 */
function getChars(s) {
    const res = new Set();
    for (const char of s) {
        res.add(char);
    }
    return res;
}

class BlacklistManager {

    constructor(client, db) {
        this.client = client;
        this.db = db;
    }

    /**
     * Get blacklisted words
     * @return {Promise<Array>}
     */
    async getWords() {
        return await this.db.getBlacklistedWords();
    }

    /**
     * Add a word to blacklisted words
     * @param word {String} The word
     * @param userId {Snowflake} The user who add the word
     * @return {Promise<void>}
     */
    async addWord(word, userId) {
        await this.db.addBlacklistWord(word, userId);
    }

    /**
     * Remove a word from blacklisted words
     * @param word {String} The word
     * @return {Promise<boolean>} All happened good
     */
    async removeWord(word) {
        return this.db.removeBlacklistedWord(word);
    }

    async isBlacklist(message) {
        const blacklistedWords = await this.getWords();
        const messageChars = getChars(message);
        for (const data of blacklistedWords) {
            const { word } = data;
            const chars = getChars(word);
            let editedMessage = message.toLowerCase();
            for (const char of messageChars) {
                if (!chars.has(char)) {
                    editedMessage = editedMessage.replaceAll(char, "");
                }
            }
            if (editedMessage.includes(word)) {
                return true;
            }
        }
        return false;
    }

}

module.exports = BlacklistManager;