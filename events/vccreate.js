const { Events, EmbedBuilder, ChannelType } = require('discord.js')
const vccreate = require('../Schemas.js/vccreate');
const vccreateuser = require('../Schemas.js/vccreateuser');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute (client, oldState, newState) {

        //vc create
        if (!oldState.channel && newState.channel) {
            const serverData = await vccreate.findOne({ Guild: newState.guild.id});
            if (!serverData || newState.channel.id !== serverData.channel) return

            const channel = await newState.guild.channels.create({
                name: serverData.Name,
                type: ChannelType.GuildVoice,
                parent: serverData.Category,
                userLimit: serverData.Limit || 0
            });

            await vccreateuser.create({
                Guild: newState.guild.id,
                User: newState.member.id,
                Channel: channel.id
            });

            await newState.member.voice.setChannel(channel).catch(err => {});
        }

        //vc delete
        if (oldState.channel && !newState.channel) {
            const userData = await vccreateuser.findOne({ Channel: oldState.channel.id});
            if (!userData) return;

            const channel = await oldState.guild.channels.resolve(oldState.channel.id);
            if (channel && channel.members.size === 0) {
                await vccreateuser.deleteOne({ Channel: oldState.channel.id});
                await channel.delete().catch(err => {});
            }
        }
    }
}