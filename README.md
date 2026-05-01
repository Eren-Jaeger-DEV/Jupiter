# Callisto Plugin Factory (CPF) 🚀

A premium automation tool for manufacturing modular plugins compatible with both **Jack** and **Callisto** Discord bot architectures.

## Features
- **AI-Powered Logic**: Uses Gemini 3.1 to write production-ready code based on your description.
- **Universal Compatibility**: Uses a dynamic shim to resolve utility paths (logger, configManager, database) automatically.
- **Scaffold Ready**: Generates full structure: `commands/`, `events/`, `services/`, and `core/`.
- **Stylized CLI**: A premium, interactive terminal interface for rapid prototyping.
- **Jack-Safe**: Follows the strict isolation rules required by the Jack engine.

## Usage

1. **Launch the Factory:**
   ```bash
   node index.js
   ```

2. **Follow the Prompts:**
   Enter the name, ID, and description.

3. **Select Destination:**
   - **Callisto**: Deploys directly to `Callisto/src/plugins`.
   - **Jack**: Deploys directly to `Jack/plugins`.
   - **Output**: Exports to `./output` for manual inspection.

## Architecture
Every manufactured plugin uses the **Universal Shim** (`core/index.js`). This shim detects the host environment and maps the correct dependencies, allowing the same plugin code to run seamlessly in both legacy Jack and modern Callisto systems.

---
*Created by Antigravity & Victor*
