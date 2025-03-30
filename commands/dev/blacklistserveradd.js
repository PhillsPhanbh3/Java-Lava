const { SlashCommandBuilder } = require('discord.js');
const blacklistserver = require('../../Schemas.js/blacklistserver');


module.exports = {
    devCommand: true,
    data: new SlashCommandBuilder()
        .setName('blacklist-server-') // Use lowercase for consistency
        .setDescription('Blacklist a server from the Java Lava beta discord bot')
        .addSubcommand(command =>
            command
                .setName('add')
                .setDescription('Add a server to the set of blacklisted servers')
                .addStringOption(option =>
                    option
                        .setName('server')
                        .setDescription('The server ID you want to blacklist')
                        .setRequired(true)
                )
        ),

    async execute(interaction, client) {
        const { options } = interaction;

        const server = options.getString('server');
        const sub = options.getSubcommand();

        // Server ID validation (basic check)
        if (!/^\d{17,19}$/.test(server)) {
            return await interaction.reply({
                content: `❌ Invalid server ID format.`,
                ephemeral: true,
            });
        }

        try {
            const data = await blacklistserver.findOne({ Guild: server });

            switch (sub) {
                case 'add':
                    if (!data) {
                        await blacklistserver.create({ Guild: server });

                        await interaction.reply({
                            content: `**Adding to blacklist...**`,
                            ephemeral: true,
                        });

                        setTimeout(async () => {
                            await interaction.editReply({
                                content: `**Indexing servers...**`,
                                ephemeral: true,
                            });

                            const check = client.guilds.cache.get(server);
                            if (check) {
                                await check.leave();
                                setTimeout(async () => {
                                    await interaction.editReply({
                                        content: `🫡 Blacklist has been **completed!** I have also left the server \`${server}\` as I was already in it.`,
                                        ephemeral: true,
                                    });
                                }, 3000); // Added delay for proper execution
                            } else {
                                setTimeout(async () => {
                                    await interaction.editReply({
                                        content: `🫡 Blacklist **completed!** I can't join \`${server}\` anymore and will leave if added.`,
                                        ephemeral: true,
                                    });
                                }, 3000); // Added missing delay
                            }
                        }, 2000);
                    } else {
                        return await interaction.reply({
                            content: `The server \`${server}\` is already **blacklisted** from the bot.`,
                            ephemeral: true,
                        });
                    }
                    break;
            }
        } catch (error) {
            console.error('Error in blacklist command:', error);
            return await interaction.reply({
                content: `⚠️ An error occurred while processing the blacklist. Please try again later.`,
                ephemeral: true,
            });
        }
    },
};
