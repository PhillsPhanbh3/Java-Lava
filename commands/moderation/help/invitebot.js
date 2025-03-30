const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-invite')
        .setDescription('Get a invite link to invite the bot to your server!'),
    async execute(interaction) {
        try {
            // Reply to the interaction
            await interaction.reply({ 
                content: 'Here is the link! https://discord.com/oauth2/authorize?client_id=1305190785536360519', 
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({ 
                content: `An error has occured, ${error.message}
                Please run this command again. If this issue persists, report it to the support server: https://discord.gg/tfSB4D4X`, 
                ephemeral: true 
            });
        }
    },
};