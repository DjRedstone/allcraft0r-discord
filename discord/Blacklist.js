const { Snowflake } = require("discord.js");
const { getChars } = require("./utils");

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

    /**
     * Check if a message is blacklist
     * @param message {String} The user message
     * @return {Promise<boolean>} The message is blacklist
     */
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