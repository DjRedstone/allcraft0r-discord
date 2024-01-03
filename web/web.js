const express = require("express");
const http = require("http");
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

        this.server.listen(this.port, () => {
            console.log(`✅ Web server running on port ${this.port}`);
            this.connected = true;
        });
    }
}

module.exports = Web