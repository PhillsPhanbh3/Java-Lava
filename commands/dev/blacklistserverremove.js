const { SlashCommandBuilder } = require('discord.js');
const blacklistserver = require('../../Schemas.js/blacklistserver');


module.exports = {
    devCommand: true,
    data: new SlashCommandBuilder()
        .setName('blacklist-server') // Lowercase for consistency
        .setDescription('Remove a blacklisted server from the Java Lava beta Discord bot')
        .addSubcommand(command =>
            command
                .setName('remove')
                .setDescription('Remove a server from the set of blacklisted servers')
                .addStringOption(option =>
                    option
                        .setName('server')
                        .setDescription('The server ID you want to REMOVE from the blacklist')
                        .setRequired(true)
                )
        ),

    async execute(interaction, client) {
        const { options } = interaction;

        const server = options.getString('server');
        const sub = options.getSubcommand();

        // ✅ Validate Server ID (Basic check)
        if (!/^\d{17,19}$/.test(server)) {
            return await interaction.reply({
                content: `❌ Invalid server ID format. Please enter a valid ID.`,
                ephemeral: true,
            });
        }

        try {
            const data = await blacklistserver.findOne({ Guild: server });

            switch (sub) {
                case 'remove':
                    if (!data) {
                        return await interaction.reply({
                            content: `🚫 The server \`${server}\` is not currently **blacklisted!**`,
                            ephemeral: true,
                        });
                    } else {
                        await blacklistserver.deleteMany({ Guild: server }); // Consider using deleteOne() if IDs are unique
                        return await interaction.reply({
                            content: `✅ I have successfully removed \`${server}\` from the **blacklist!**`,
                            ephemeral: true,
                        });
                    }
                default:
                    return await interaction.reply({
                        content: `⚠️ Unknown subcommand. Please use \`/dev-blacklist-server-add remove\`.`,
                        ephemeral: true,
                    });
            }
        } catch (error) {
            console.error('Error removing blacklist:', error);
            return await interaction.reply({
                content: `⚠️ An error occurred while processing your request. Please try again later.`,
                ephemeral: true,
            });
        }
    },
};
