const { Events, EmbedBuilder } = require('discord.js');
const { LogError } = require('../utils/LogError.js');

module.exports = {
    name: Events.GuildDelete,
    async execute(client, guild) {
        try {

        const channelId = '1311429720767987712';
        const channel = client.channels.cache.get(channelId);

        if (!channel) console.log ('Channel not found for logging guild leave');
        const embed = new EmbedBuilder()
            .setTitle('Left Guild')
            .setDescription(`I have left the guild ${guild.name} with ${guild.memberCount} members!`)
            .setColor('#FF0000')
            .setTimestamp();

        if(channel) {
            channel.send({ embeds: [embed] });
        }
        console.log(`Left guild ${guild.name} with ${guild.memberCount} members!`);
        } catch (error) {
            LogError(error, client);
            console.log(error);
        }
    }
}
