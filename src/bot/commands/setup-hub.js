const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-hub')
        .setDescription('Automatically architect the Jupiter Hub server.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async run(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const guild = interaction.guild;

        try {
            // 0. Set Server Icon
            const iconPath = '/home/victor/.gemini/antigravity/brain/5a60043c-0c3a-4998-a5f6-12d1fac972ba/jupiter_hub_icon_1777631487950.png';
            if (fs.existsSync(iconPath)) {
                await guild.setIcon(iconPath);
            }

            // 1. Define Architecture
            const architecture = [
                {
                    category: '🛰️ ORBITAL ENTRY',
                    channels: [
                        { name: '🛸-welcome', topic: 'Welcome to Jupiter Hub. Orbital entry protocols.' },
                        { name: '📋-hub-manual', topic: 'How to use Jupiter to manufacture plugins.' }
                    ]
                },
                {
                    category: '🏭 THE FACTORY',
                    channels: [
                        { name: '🏗️-manufacturing', topic: 'The main floor for using /manufacture.' },
                        { name: '🧪-testing-lab', topic: 'A sandbox for trying out AI-generated code.' }
                    ]
                },
                {
                    category: '📡 MISSION CONTROL',
                    channels: [
                        { name: '📊-moon-status', topic: 'A live feed of all active Moons.', readOnly: true },
                        { name: '📜-global-logs', topic: 'Centralized logs from the entire ecosystem.', readOnly: true }
                    ]
                },
                {
                    category: '💬 CREW QUARTERS',
                    channels: [
                        { name: '🛰️-owners-lounge', topic: 'Chat for Moon owners and developers.' },
                        { name: '🆘-tech-support', topic: 'Where Jupiter assists with installation errors.' }
                    ]
                }
            ];

            // 2. Build Architecture
            for (const cat of architecture) {
                const category = await guild.channels.create({
                    name: cat.category,
                    type: ChannelType.GuildCategory
                });

                for (const chan of cat.channels) {
                    const channel = await guild.channels.create({
                        name: chan.name,
                        type: ChannelType.GuildText,
                        parent: category.id,
                        topic: chan.topic,
                        permissionOverwrites: chan.readOnly ? [
                            {
                                id: guild.id,
                                deny: [PermissionFlagsBits.SendMessages]
                            }
                        ] : []
                    });

                    // Send Embed to explain the channel
                    const embed = new EmbedBuilder()
                        .setTitle(`${chan.name.toUpperCase()}`)
                        .setDescription(chan.topic)
                        .setColor('#00ffff')
                        .setFooter({ text: 'Jupiter Space Command', iconURL: interaction.client.user.displayAvatarURL() });

                    await channel.send({ embeds: [embed] });
                }
            }

            await interaction.editReply({ content: '✅ **JUPITER HUB ARCHITECTED.** The command center is now online.' });

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: `❌ **ARCHITECTURAL FAILURE:** ${error.message}` });
        }
    }
};
