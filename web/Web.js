const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

class Web {
    constructor(discord, db, port) {
        this.connected = false;
        this.discord = discord;
        this.db = db;
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socketIO(this.server);

        this.app.use("/jquery", express.static("node_modules/jquery/dist"));
        this.app.use("/socket.io", express.static("node_modules/socket.io/dist"));
        this.app.use(express.static("web/src"));
        this.app.use(express.static("web/public"));

        this.app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "src/index.html"));
        });

        this.app.get("/leaderboard", async (req, res) => {
            const leaderboard = await this.db.getLeaderboard();
            res.send(leaderboard);
        });

        this.server.listen(this.port, () => {
            console.log(`✅ Web server running on port ${this.port}`);
            this.connected = true;
        });
    }
}

module.exports = Web