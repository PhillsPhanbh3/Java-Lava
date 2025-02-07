const { ActivityType } = require('discord.js');
const mongoose = require('mongoose');
const mongoURL = process.env.mongoURL;

const statuses = [
    { name: '/support', type: ActivityType.Streaming, url: 'https://www.twitch.tv/discord' },
    { name: 'new update', type: ActivityType.Streaming, url: 'https://www.twitch.tv/discord' },
    { name: 'version 1.05.1', type: ActivityType.Streaming, url: 'https://www.twitch.tv/discord' },
    { name: 'version 2.00 expected by march 2025', type: ActivityType.Streaming, url: 'https://www.twitch.tv/discord' },
    { name: 'potential premium bot coming out in a couple months', type: ActivityType.Streaming, url: 'https://www.twitch.tv/discord' }
];

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        // Initial status
        let i = 0;
        client.user.setActivity(statuses[i]);

        // Rotate status every 10 seconds
        setInterval(() => {
            i = (i + 1) % statuses.length;  // Loop through the statuses
            client.user.setActivity(statuses[i]);
        }, 10000);  // 10 seconds (10000ms)

        if (!mongoURL) return;

        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        if (mongoose.connection.readyState === 1) {
            console.log('I have connected to the database!');
        } else {
            console.log('I cannot connect to the database right now...');
        }
    },
};