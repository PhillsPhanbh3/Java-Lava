const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('website')
        .setDescription('Get the link to the website!'),
    async execute(interaction) {
        try {
            // Reply to the interaction
            await interaction.reply({ 
                content: 'Here is the link! https://sites.google.com/view/javalavabot/home', 
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