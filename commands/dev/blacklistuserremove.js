const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const blacklist = require('../../Schemas.js/blacklistuser.js');

module.exports = {
    devCommand: true,
    data: new SlashCommandBuilder()
    .setName('blacklist-user-')
    .setDescription('Blacklist a user from using this bot')
    .addSubcommand(command => command.setName('remove').setDescription('Remove a user from the blacklist').addUserOption(option => option.setName('user').setDescription('The user ID you want to REMOVE blacklist').setRequired(true))),
    async execute (interaction) {
    
            const { options } = interaction;
            const user = options.getUser('user');
            const data = await blacklist.findOne({ User: user.id});
            const sub = options.getSubCommand();
    
            switch (sub) {
                case 'remove':
    
                if (!data) {
                    return await interaction.reply({ content: `The user ${user} is not **blacklisted**`, ephermal: true });
                } else if (data) {
                    await blacklist.deleteMany({ User: user.id});

                    const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`🛠️ the user ${user} has been removed from the blacklist`)

                    await interaction.reply({ embeds: [embed], ephermal: true });
                }
            }
        }
}