// Loading modules
const CONFIG = require("./config.json");
const DB = require("./db/Db.js");
const Discord = require("./discord/Discord.js");
const Web = require("./web/Web.js");

// Starting modules
const db = new DB(CONFIG.MYSQL);
const discord = new Discord(CONFIG.DISCORD, db);
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
