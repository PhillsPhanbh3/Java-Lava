const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Get the link to the Privacy Policy of the bot!'),
    async execute(interaction) {
        try {
            // Reply to the interaction
            await interaction.reply({ 
                content: 'Here is the link! https://discord.gg/WSf42EMxhA', 
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({ 
                content: `${error.message}
                Please run this command again. If this issue persists, report it to the support server: https://discord.gg/tfSB4D4X`, 
                ephemeral: true 
            });
        }
    },
};