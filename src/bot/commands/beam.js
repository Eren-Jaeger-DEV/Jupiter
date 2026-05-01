const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const dockingStation = require('../../core/DockingStation');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('beam')
        .setDescription('Beam a manufactured plugin to a docked Moon.')
        .addStringOption(option => 
            option.setName('plugin')
                .setDescription('The name of the plugin folder in output/')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('moon')
                .setDescription('The ID of the docked Moon (e.g. europa)')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async run(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const pluginName = interaction.options.getString('plugin');
        const moonId = interaction.options.getString('moon');

        const pluginPath = path.join(__dirname, '../../../output', pluginName);

        if (!fs.existsSync(pluginPath)) {
            return await interaction.editReply({ content: `❌ **BEAM FAILURE:** Plugin \`${pluginName}\` not found in the manufacturing output.` });
        }

        try {
            // 1. Read all files in the plugin folder
            const files = {};
            const getAllFiles = (dirPath, relativePath = '') => {
                const items = fs.readdirSync(dirPath);
                for (const item of items) {
                    const fullPath = path.join(dirPath, item);
                    const relPath = path.join(relativePath, item);
                    if (fs.statSync(fullPath).isDirectory()) {
                        getAllFiles(fullPath, relPath);
                    } else {
                        files[relPath] = fs.readFileSync(fullPath, 'utf8');
                    }
                }
            };
            getAllFiles(pluginPath);

            // 2. Beam via Docking Station
            await dockingStation.beamPlugin(moonId, pluginName, files);

            await interaction.editReply({ content: `📡 **STELLAR BEAM SUCCESSFUL:** Plugin \`${pluginName}\` has been beamed to Moon \`${moonId}\`.` });

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: `❌ **BEAM FAILURE:** ${error.message}` });
        }
    }
};
