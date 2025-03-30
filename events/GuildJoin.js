const { Events, EmbedBuilder } = require('discord.js');
const { LogError } = require('../utils/LogError.js');

module.exports = {
    name: Events.GuildCreate,
    async execute(client, guild) {
        try {
            const channelId = '1311429720767987712';
            const channel = client.channels.cache.get(channelId);
            if (!channel) console.log('Channel not found for GuildJoin.js');

            const embed = new EmbedBuilder()
                .setTitle('New Guild!')
                .setDescription(`Joined guild ${guild.name} with ${guild.memberCount} members!`)
                .setColor('#00FF00')
                .setTimestamp();

            console.log(`Joined guild ${guild.name} with ${guild.memberCount} members!`);
            if (channel) {
                channel.send({ embeds: [embed] });
            }
        } catch (error) {
            LogError(error, client);
            console.log(error)
        }

    }
}
