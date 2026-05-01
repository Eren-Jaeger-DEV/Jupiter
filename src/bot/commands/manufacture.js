const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const factory = require('../../core/factory');
const path = require('path');
const fs = require('fs-extra');
const AdmZip = require('adm-zip');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('manufacture')
        .setDescription('Request a new plugin for your Moon (Callisto).'),

    async run(interaction) {
        // We'll use a Modal to collect details
        const modal = new ModalBuilder()
            .setCustomId('manufacture_modal')
            .setTitle('Jupiter Plugin Factory');

        const nameInput = new TextInputBuilder()
            .setCustomId('plugin_name')
            .setLabel("What is the plugin name?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('e.g. Economy System')
            .setRequired(true);

        const promptInput = new TextInputBuilder()
            .setCustomId('plugin_prompt')
            .setLabel("Describe the features in detail:")
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('e.g. I want a level system where users get XP for chatting and can check their rank with /rank...')
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(promptInput)
        );

        await interaction.showModal(modal);
    }
};
