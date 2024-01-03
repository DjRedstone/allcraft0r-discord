// Loading modules
const CONFIG = require("./config.json");
const DB = require("./db/db.js");
const Discord = require("./discord/discord.js");
const Web = require("./web/web.js");

// Starting modules
const db = new DB(CONFIG.MYSQL);
const discord = new Discord(CONFIG.DISCORD_TOKEN, db);
const web = new Web(discord, db, CONFIG.PORT);

// Send message when every module loaded
const allLoadedLoop = () => {
    if (db.connected && discord.connected && web.connected) {
        console.info("✅ All modules loaded!");
    } else {
        setTimeout(allLoadedLoop, 100);
    }
}
allLoadedLoop();
