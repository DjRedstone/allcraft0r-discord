const fs = require("node:fs");
const path = require("node:path");
const MoneyManager = require("./Money.js");
const { Client, GatewayIntentBits, Collection, Events, REST, Routes, ActivityType, Snowflake } = require("discord.js");
const cron = require("node-cron");

/**
 * Get index of element from array by key name
 * @param {Array<Object>} l - The array
 * @param {String} k - The key
 * @param search - The value
 */
global.getFromArray = (l, k, search) => {
    for (let i = 0; i < l.length; i++) {
        if (l[i][k] === search) {
            return i;
        }
    }
}

class Discord {
    PREFIX = "[Discord]";

    /**
     * The constructor
     * @param {Object} config - The configuration
     * @param {Db} db - A dabase manager
     */
    constructor(config, db) {
        const { TOKEN, CLIENT_ID, GUILD_ID, ADMIN_CHANNEL_ID, LOG_CHANNEL_ID } = config;
        this.token = TOKEN;
        this.clientId = CLIENT_ID;
        this.guildId = GUILD_ID;
        this.connected = false;

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ],
        });

        const moneyManager = new MoneyManager(this.client, db);

        /** @type {{redstone_emoji: String, money: MoneyManager, db: Db}} */
        global.discord = {
            money: moneyManager,
            db: db,
            redstone_emoji: "<:redstone:503978809645727745>"
        };

        this.loadCommands();

        this.client.login(TOKEN).then(async () => {
            console.info("✅ Discord app connected!");

            global.discord.adminChannel = await this.client.channels.fetch(ADMIN_CHANNEL_ID);
            global.discord.logChannel = await this.client.channels.fetch(LOG_CHANNEL_ID);

            this.loadOnMessageMoney();

            let next = false;
            const activities = [
                { name: "les vidéos d'allcraft0r", type: ActivityType.Watching },
                { name: "faire de la redstone", type: ActivityType.Playing }
            ];
            cron.schedule("*/100 * * * * *", () => {
                this.client.user.setPresence({
                    activities: [activities[next ? 0 : 1]],
                    status: "online"
                });
                next = !next;
            });

            this.connected = true;
        });
    }

    /**
     * Inform in logs
     * @param {String} text
     */
    info(text) {
        console.info(`${this.PREFIX} ${text}`);
    }

    /**
     * Warn in logs
     * @param {String} text
     */
    warn(text) {
        console.warn(`${this.PREFIX} ${text}`);
    }

    /**
     * Error in logs
     * @param {String} text
     */
    error(text) {
        console.error(`${this.PREFIX} ${text}`);
    }

    /**
     * Load commands
     */
    loadCommands() {
        this.client.commands = new Collection();
        const commands = [];

        const publicCommands = this.exploreFolder("commands/public");
        global.discord.publicCommands = publicCommands;
        for (const data of publicCommands) {
            for (const cmd of data.commands) {
                this.client.commands.set(cmd.data.name, cmd);
                commands.push(cmd.data.toJSON());
                if (cmd.listeners) {
                    for (const lData of cmd.listeners) {
                        const { event, listener } = lData;
                        this.client.on(event, listener);
                    }
                }
            }
        }
        const helpCmdIndex = global.getFromArray(commands, "name", "help");
        if (helpCmdIndex) {
            commands[helpCmdIndex].options[0].choices = [];
            for (const data of global.discord.publicCommands) {
                commands[helpCmdIndex].options[0].choices.push({
                    name: data.name,
                    value: data.folderName
                });
            }
        }

        this.client.on(Events.InteractionCreate, async interaction => {
            if (!interaction.isChatInputCommand()) return;

            const cmd = this.client.commands.get(interaction.commandName);

            if (!cmd) {
                this.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await cmd.execute(interaction);
            } catch (error) {
                this.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true });
                } else {
                    await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
                }
            }
        });

        const rest = new REST().setToken(this.token);

        (async () => {
            try {
                this.info(`Started refreshing ${commands.length} application (/) commands...`);

                const data = await rest.put(
                    Routes.applicationGuildCommands(this.clientId, this.guildId),
                    { body: commands },
                );

                this.info(`Successfully reloaded ${data.length} application (/) commands!`);
            } catch (error) {
                this.error(error);
            }
        })();
    }

    /**
     * Explore a directory and get commands types with commands
     * @param {String} dir - The directory path
     * @returns {Array<Object>}
     */
    exploreFolder(dir) {
        const res = [];
        const foldersPath = path.join(__dirname, dir)
        for (const folder of fs.readdirSync(foldersPath)) {
            const commandsPath = path.join(foldersPath, folder);
            const dataPath = path.join(commandsPath, "data.json");
            const data = fs.existsSync(dataPath) ? require(dataPath) : {
                name: folder,
                color: "black"
            };
            data.folderName = folder;
            data.commands = [];
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const cmd = require(filePath);
                if ("data" in cmd && "execute" in cmd) {
                    data.commands.push(cmd);
                } else {
                    this.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
            res.push(data);
        }
        return res;
    }

    loadOnMessageMoney() {
        /** @type {Set<Snowflake>} */
        const messageMinute = new Set();
        cron.schedule("* * * * *", () => messageMinute.clear());

        this.client.on(Events.MessageCreate, async message => {
            if (message.author.bot) return;
            if (Math.random() < 0.5) {
                if (!messageMinute.has(message.author.id)) {
                    if (message.content.length > 10) {
                        await global.discord.money.add(message.author.id, 1);
                        messageMinute.add(message.author.id);
                    }
                }
            }
        });
    }
}

module.exports = Discord;