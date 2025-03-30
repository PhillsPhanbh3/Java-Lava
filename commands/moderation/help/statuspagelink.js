const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status-page')
        .setDescription('Get the link to the status page!'),
    async execute(interaction) {
        try {
            // Reply to the interaction
            await interaction.reply({ 
                content: 'Here is the link! https://javalavabotstatus.statuspage.io/', 
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