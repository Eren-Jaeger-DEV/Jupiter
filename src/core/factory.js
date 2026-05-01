const fs = require('fs-extra');
const path = require('path');
const colors = require('colors');

class PluginFactory {
    constructor() {
        this.templateDir = path.join(__dirname, '../templates');
    }

    /**
     * Generates a full plugin structure
     * @param {Object} options 
     */
    async generate(options) {
        const { id, name, outputDir } = options;
        const pluginPath = path.join(outputDir, id);

        console.log(`\n🚀 ${'STARTING PRODUCTION:'.bold.cyan} ${name.toUpperCase().white}`);

        // 1. Create structure
        await fs.ensureDir(pluginPath);
        await fs.ensureDir(path.join(pluginPath, 'commands'));
        await fs.ensureDir(path.join(pluginPath, 'events'));
        await fs.ensureDir(path.join(pluginPath, 'services'));
        await fs.ensureDir(path.join(pluginPath, 'core'));

        // 2. Generate Core Shim
        await this.copyTemplate('shim.js.template', path.join(pluginPath, 'core', 'index.js'), options);

        // 3. Generate Manifest
        await this.copyTemplate('plugin.json.template', path.join(pluginPath, 'plugin.json'), options);

        // 4. Generate Main Entry
        await this.copyTemplate('index.js.template', path.join(pluginPath, 'index.js'), options);

        // 5. Generate Commands & Events (AI or Template)
        if (options.aiPrompt) {
            console.log(`🧠 ${'CONSULTING AI ARCHITECT...'.bold.magenta}`);
            const aiGenerator = require('./aiGenerator');
            
            const commandCode = await aiGenerator.generatePluginLogic(options.aiPrompt, 'Slash Command');
            await fs.writeFile(path.join(pluginPath, 'commands', `${options.id}.js`), commandCode);
            console.log(`   ${'→'.grey} ${options.id}.js (AI Generated) created.`);

            const eventCode = await aiGenerator.generatePluginLogic(options.aiPrompt, 'Event Listener');
            await fs.writeFile(path.join(pluginPath, 'events', 'interactionCreate.js'), eventCode);
            console.log(`   ${'→'.grey} interactionCreate.js (AI Generated) created.`);
        } else if (options.includeSample) {
            const cmdOptions = { ...options, commandName: 'ping', commandDescription: 'Check bot latency', category: 'General', permissions: 'PermissionFlagsBits.SendMessages' };
            await this.copyTemplate('command.js.template', path.join(pluginPath, 'commands', 'ping.js'), cmdOptions);
            
            const eventOptions = { ...options, eventName: 'ready' };
            await this.copyTemplate('event.js.template', path.join(pluginPath, 'events', 'ready.js'), eventOptions);
        }

        console.log(`✅ ${'SUCCESS:'.bold.green} Plugin ${id.yellow} manufactured at ${pluginPath.grey}`);
        return pluginPath;
    }

    async copyTemplate(templateName, destPath, options) {
        const templatePath = path.join(this.templateDir, templateName);
        let content = await fs.readFile(templatePath, 'utf8');

        // Simple Mustache-style replacement
        for (const [key, value] of Object.entries(options)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, value);
        }

        await fs.writeFile(destPath, content);
        console.log(`   ${'→'.grey} ${path.basename(destPath).white} created.`);
    }
}

module.exports = new PluginFactory();
