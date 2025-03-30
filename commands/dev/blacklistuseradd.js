const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const blacklist = require('../../Schemas.js/blacklistuser.js');

module.exports = {
    devCommand: true,
    data: new SlashCommandBuilder()
    .setName('blacklist-user-add')
    .setDescription('Blacklist a user from using this bot')
    .addSubcommand(command => command.setName('add').setDescription('Add a user to the blacklist').addUserOption(option => option.setName('user').setDescription('The user ID you want to blacklist').setRequired(true))),
    async execute (interaction) {

        const { options } = interaction;
        const user = options.getUser('user');
        const data = await blacklist.findOne({ User: user.id});
        const sub = options.getSubcommand();

        switch (sub) {
            case 'add':

            if (!data) {
                await blacklist.create({
                    User: user.id,
                })

                const embed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`🔨 The user \`${user}\` has been blacklisted from using any commands on this bot`)

                await interaction.reply({ embeds: [embed], ephermal: true });
            } else if (data) {
                return await interaction.reply({ content: `The user \`${user}\` has already been **BLACKLISTED**`, ephermal: true});
            }
        }
    }
}