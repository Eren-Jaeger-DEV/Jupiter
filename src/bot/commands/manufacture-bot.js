const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const engineFactory = require('../../core/engineFactory');
const path = require('path');
const AdmZip = require('adm-zip');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manufacture-bot')
        .setDescription('Construct a complete Universal Bot Engine.'),

    async run(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('manufacture_bot_modal')
            .setTitle('Universal Bot Factory');

        const nameInput = new TextInputBuilder()
            .setCustomId('bot_name')
            .setLabel("Bot Name")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('e.g. Europa, Ganymede, Io...')
            .setRequired(true);

        const descInput = new TextInputBuilder()
            .setCustomId('bot_desc')
            .setLabel("What is this bot's mission?")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('e.g. A dedicated moderation bot for the Jupiter Hub...')
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(descInput)
        );

        await interaction.showModal(modal);
    }
};
