const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mass-unban')
    .setDescription('Unbans EVERY SINGLE PERSON IN YOUR BANS LIST from your SERVER'),
    async execute (interaction) {

        const { options, guild, ownerId } = interaction;
        const users = await interaction.guild.bans.fetch();
        const ids = users.map(u => u.user.id);

        if (interaction.user.Id != ownerId) return await interaction.reply({ content: 'You MUST be the server owner in order to use this command, the server owner is the person that has the crown, that user is the only user that can run this command', ephermal: true});

        if (!users) return await interaction.reply({ content: `There is no one banned in this server`, ephermal: true});

        await interaction.reply({ content: `<a:Loading:1294279339361304608> Unbanning everyone in your server, this may take a while, if you notice in your logs that the bot has stopped please contact the devs of the bot that way he can put out a support noti`});

        for (const id of ids) {
            await guild.members.unban(id)
            .catch(err => {
                return interaction.editReply({ content: `${err.rawError}`});
            });
        }

        const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`<:Verified:1320110619705475072> ${ids.length} members have been **UNBANNED** from this server`)

        await interaction.editReply({ content: '', embeds: [embed] });

    }
}