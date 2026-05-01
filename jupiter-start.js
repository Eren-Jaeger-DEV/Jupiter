const JupiterClient = require('./src/core/JupiterClient');

const jupiter = new JupiterClient();

async function launch() {
    try {
        await jupiter.start();
    } catch (error) {
        console.error("CRITICAL: Failed to launch Jupiter Master Orchestrator.");
        console.error(error);
        process.exit(1);
    }
}

launch();
