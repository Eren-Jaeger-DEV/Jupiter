const fs = require('fs-extra');
const path = require('path');
const colors = require('colors');

class EngineFactory {
    constructor() {
        this.templateDir = path.join(__dirname, '../templates/engine');
    }

    async generate(options) {
        const { id, name, outputDir } = options;
        const botPath = path.join(outputDir, `${id}-engine`);

        console.log(`\n🌌 ${'CONSTRUCTING ENGINE:'.bold.blue} ${name.toUpperCase().white}`);

        // 1. Create Structure
        await fs.ensureDir(botPath);
        await fs.ensureDir(path.join(botPath, 'core'));
        await fs.ensureDir(path.join(botPath, 'utils'));
        await fs.ensureDir(path.join(botPath, 'database/models'));
        await fs.ensureDir(path.join(botPath, 'plugins'));
        await fs.ensureDir(path.join(botPath, 'commands/core'));
        await fs.ensureDir(path.join(botPath, 'events'));

        // 2. Copy Templates with replacements
        await this.copyTemplate('package.json.template', path.join(botPath, 'package.json'), options);
        await this.copyTemplate('index.js.template', path.join(botPath, 'index.js'), options);
        await this.copyTemplate('MoonClient.js.template', path.join(botPath, 'core', 'MoonClient.js'), options);
        await this.copyTemplate('StellarLink.js.template', path.join(botPath, 'core', 'StellarLink.js'), options);

        // 3. Copy Static Utils
        await fs.copy(path.join(this.templateDir, 'utils/logger.js'), path.join(botPath, 'utils/logger.js'));
        await fs.copy(path.join(this.templateDir, 'utils/banner.js'), path.join(botPath, 'utils/banner.js'));

        // 4. Create .env Template
        const envContent = `DISCORD_TOKEN=YOUR_TOKEN_HERE\nCLIENT_ID=YOUR_CLIENT_ID_HERE\nMONGODB_URI=mongodb://localhost:27017/${id}\nSTELLAR_SECRET=${process.env.STELLAR_SECRET}\nJUPITER_LINK=http://localhost:3000\n`;
        await fs.writeFile(path.join(botPath, '.env.template'), envContent);

        console.log(`✅ ${'ENGINE STABILIZED:'.bold.green} ${id.yellow} ready for takeoff.`);
        return botPath;
    }

    async copyTemplate(templateName, destPath, options) {
        const templatePath = path.join(this.templateDir, templateName);
        let content = await fs.readFile(templatePath, 'utf8');

        for (const [key, value] of Object.entries(options)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            content = content.replace(regex, value);
        }

        await fs.writeFile(destPath, content);
        console.log(`   ${'→'.grey} ${path.basename(destPath).white} manufactured.`);
    }
}

module.exports = new EngineFactory();
