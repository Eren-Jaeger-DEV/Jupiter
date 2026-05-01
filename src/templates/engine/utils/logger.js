const colors = require('colors');

module.exports = {
    info: (tag, msg) => console.log(`[${tag.cyan}] ${'INFO'.green}: ${msg}`),
    warn: (tag, msg) => console.log(`[${tag.cyan}] ${'WARN'.yellow}: ${msg}`),
    error: (tag, msg) => console.log(`[${tag.cyan}] ${'ERROR'.red}: ${msg}`),
    critical: (tag, msg) => console.log(`[${tag.cyan}] ${'CRIT'.bgRed.white}: ${msg}`)
};
