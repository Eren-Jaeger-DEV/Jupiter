#!/usr/bin/env node

const inquirer = require('inquirer');
const colors = require('colors');
const path = require('path');
const factory = require('./src/core/factory');

const BANNER = `
${'██████╗ █████╗ ██╗     ██╗     ██╗███████╗████████╗ ██████╗ '.cyan}
${'██╔════╝██╔══██╗██║     ██║     ██║██╔════╝╚══██╔══╝██╔═══██╗'.cyan}
${'██║     ███████║██║     ██║     ██║███████╗   ██║   ██║   ██║'.cyan}
${'██║     ██╔══██║██║     ██║     ██║╚════██║   ██║   ██║   ██║'.cyan}
${'╚██████╗██║  ██║███████╗███████╗██║███████║   ██║   ╚██████╔╝'.cyan}
${' ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚══════╝   ╚═╝    ╚═════╝ '.cyan}
${'                     PLUGIN FACTORY v1.0.0                      '.bold.white}
`;

async function run() {
    console.clear();
    console.log(BANNER);

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of your plugin?',
            default: 'New Feature'
        },
        {
            type: 'input',
            name: 'id',
            message: 'What is the plugin ID (kebab-case)?',
            default: (ans) => ans.name.toLowerCase().replace(/ /g, '-')
        },
        {
            type: 'input',
            name: 'description',
            message: 'Brief description of the plugin:',
            default: 'A modular feature for the Callisto/Jack engine.'
        },
        {
            type: 'input',
            name: 'author',
            message: 'Author name:',
            default: 'Victor & Antigravity'
        },
        {
            type: 'input',
            name: 'version',
            message: 'Version:',
            default: '1.0.0'
        },
        {
            type: 'confirm',
            name: 'useAI',
            message: 'Use AI to generate plugin logic?',
            default: true
        },
        {
            type: 'input',
            name: 'aiPrompt',
            message: 'Describe what the plugin should do (e.g. "A level system with XP"):',
            when: (ans) => ans.useAI
        },
        {
            type: 'confirm',
            name: 'includeSample',
            message: 'Include sample command and event?',
            default: true,
            when: (ans) => !ans.useAI
        }
    ]);

    // Choose target project for output
    const target = await inquirer.prompt([
        {
            type: 'list',
            name: 'outputDir',
            message: 'Where should we manufacture this plugin?',
            choices: [
                { name: 'Directly to Callisto (src/plugins)', value: path.join(__dirname, '../Callisto/src/plugins') },
                { name: 'Directly to Jack (plugins)', value: path.join(__dirname, '../Jack/plugins') },
                { name: 'Export to Factory root (./output)', value: path.join(__dirname, './output') }
            ]
        }
    ]);

    const options = { ...answers, ...target };

    try {
        await factory.generate(options);
        console.log(`\n${'READY FOR DEPLOYMENT.'.bold.green}`);
        console.log(`${'Note:'.grey} Restart your bot to register the new plugin.\n`);
    } catch (error) {
        console.error(`\n❌ ${'CRITICAL MANUFACTURING ERROR:'.bold.red}`);
        console.error(error.message);
    }
}

run();
