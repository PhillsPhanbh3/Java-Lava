const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('terms-of-service')
        .setDescription('Get the link to the Terms of service of the bot!'),
    async execute(interaction) {
        try {
            // Reply to the interaction
            await interaction.reply({ 
                content: 'Here is the link! https://sites.google.com/view/javalavabot/terms-of-service?authuser=0', 
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({ 
                content: `an error has occured, ${error.message}
                Please run this command again. If this issue persists, report it to the support server: https://discord.gg/tfSB4D4X`, 
                ephemeral: true 
            });
        }
    },
};