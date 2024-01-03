const { Client, GatewayIntentBits } = require("discord.js");

class Discord {
    constructor(token, db) {
        this.connected = false;
        this.db = db;
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
        });
        this.client.login(token).then(() => {
            console.info("✅ Discord app connected!");
            this.connected = true;
        });
    }
}

module.exports = Discord;