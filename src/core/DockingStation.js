const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const logger = require('../utils/logger');
const fs = require('fs-extra');
const path = require('path');

class DockingStation {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server);
        this.moons = new Map();
    }

    start(port = 3000) {
        this.server.listen(port, () => {
            console.log(`\n📡 ${'DOCKING STATION:'.bold.bgBlue.white} Listening for Moon signals on port ${port.toString().yellow}\n`);
        });

        this.io.on('connection', (socket) => {
            const moonId = socket.handshake.query.moonId;
            const secret = socket.handshake.query.secret;

            // Security Check
            if (secret !== process.env.STELLAR_SECRET) {
                logger.error('DOCKING', `Unauthorized docking attempt from: ${moonId}`);
                socket.disconnect();
                return;
            }

            logger.info('DOCKING', `Moon **${moonId}** has successfully docked.`);
            this.moons.set(moonId, socket);

            socket.on('telemetry', (data) => {
                // Handle stats from the moon
                // console.log(`[${moonId}] Telemetry:`, data);
            });

            socket.on('disconnect', () => {
                logger.warn('DOCKING', `Moon **${moonId}** has drifted out of orbit.`);
                this.moons.delete(moonId);
            });
        });
    }

    async beamPlugin(moonId, pluginName, files) {
        const socket = this.moons.get(moonId);
        if (!socket) {
            throw new Error(`Moon ${moonId} is not currently docked.`);
        }

        logger.info('BEAM', `Beaming plugin **${pluginName}** to Moon **${moonId}**...`);
        socket.emit('plugin_beam', { pluginName, files });
    }
}

module.exports = new DockingStation();
