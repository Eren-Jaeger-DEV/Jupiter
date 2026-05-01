const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
require('dotenv').config();

class JupiterClient extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        });

        this.commands = new Collection();
    }

    async start() {
        console.log(`\n${'   [ JUPITER MASTER ORCHESTRATOR ]   '.bold.bgCyan.white}\n`);
        
        // 1. Load Commands & Events
        await this.loadCommands();
        await this.loadEvents();
        
        // 2. Start Docking Station
        const dockingStation = require('./DockingStation');
        dockingStation.start(process.env.DOCKING_PORT || 3000);

        // 3. Register Slash Commands
        await this.registerSlashCommands();

        // 3. Login
        await this.login(process.env.DISCORD_TOKEN);
        
        this.on('ready', () => {
            console.log(`✅ ${'JUPITER ONLINE:'.bold.green} Authenticated as ${this.user.tag.cyan}`);
            console.log(`📡 ${'STATION STATUS:'.bold.yellow} Awaiting plugin orders...\n`);
        });
    }

    async loadCommands() {
        const commandsPath = path.join(__dirname, '../bot/commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(path.join(commandsPath, file));
            this.commands.set(command.data.name, command);
        }
    }

    async loadEvents() {
        const eventsPath = path.join(__dirname, '../bot/events');
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(path.join(eventsPath, file));
            if (event.once) {
                this.once(event.name, (...args) => event.execute(...args, this));
            } else {
                this.on(event.name, (...args) => event.execute(...args, this));
            }
        }
    }

    async registerSlashCommands() {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        const commandData = Array.from(this.commands.values()).map(c => c.data.toJSON());

        try {
            console.log(`📡 ${'SYNCING:'.bold.magenta} Updating orbital command arrays...`);
            await rest.put(
                Routes.applicationCommands(Buffer.from(process.env.DISCORD_TOKEN.split('.')[0], 'base64').toString()),
                { body: commandData },
            );
        } catch (error) {
            console.error("Failed to register Jupiter commands:", error);
        }
    }
}

module.exports = JupiterClient;
