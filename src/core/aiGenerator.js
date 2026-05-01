const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

class AIGenerator {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });
    }

    async generatePluginLogic(prompt, componentType) {
        const systemPrompt = `
You are the Lead Architect for the Callisto Plugin Factory. 
Your task is to write high-quality, production-ready JavaScript code for a Discord.js plugin component.

CRITICAL INSTRUCTION: We are generating ONLY the \${componentType}. Do NOT output multiple files. Output ONLY the raw Javascript code for this SINGLE file. Do NOT include comments indicating other file paths.
PATH RULES (STRICTLY FOLLOW):
- From commands/someCommand.js -> require('../core')   (one level up to plugin root, then into core/)
- From events/someEvent.js     -> require('../core')   (one level up to plugin root, then into core/)
- From index.js                -> require('./core')    (same level, into core/)
- NEVER use '../../core' - this is WRONG and will crash the bot.

ARCHITECTURE RULES:
1. Universal Shim import: const { logger, configManager } = require('../core');
2. Logger Signature: logger.info(tag, message)
3. Command Format: Export an object with 'name', 'data' (SlashCommandBuilder), and 'async run(ctx)'.
4. Event Format: Export an object with 'name' and 'async execute(...args, client)'.
5. Context (ctx): In commands, use 'ctx.reply()', 'ctx.user', 'ctx.guild'.
6. No Hardcoding: Use configManager where possible.
7. Pure Logic: Keep business logic clean.
8. CRITICAL - Options: EVERY .addStringOption(), .addUserOption(), .addIntegerOption() etc. MUST have a .setDescription() call or Discord.js will crash.
   CORRECT:   .addUserOption(o => o.setName('target').setDescription('The target user').setRequired(true))
   INCORRECT: .addUserOption(o => o.setName('target').setRequired(true))

COMPONENT: ${componentType}
USER PROMPT: ${prompt}

Return ONLY the raw JavaScript code for the ${componentType}. No markdown formatting, no backticks, no explanatory text, and DO NOT combine multiple files.
`;

        try {
            const result = await this.model.generateContent(systemPrompt);
            const response = await result.response;
            let code = response.text();
            
            // Cleanup any accidental markdown
            code = code.replace(/```javascript/g, '').replace(/```/g, '').trim();
            
            return code;
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw new Error("Failed to generate code via AI.");
        }
    }
}

module.exports = new AIGenerator();
