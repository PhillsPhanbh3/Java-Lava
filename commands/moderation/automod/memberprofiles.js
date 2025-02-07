const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod-member')
        .setDescription('Setup custom words to be prevented by the automod system with the block messages suspected of spam')
        .addSubcommand(command => 
            command
                .setName('profile')
                .setDescription('Block custom words within a member\'s profile')
                .addStringOption(option => 
                    option
                        .setName('word')
                        .setDescription('The word you want to block from member profiles')
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        const { guild, options } = interaction;

        // Ensure this command is run within a guild
        if (!guild) {
            return await interaction.reply({ content: 'This command can only be used within a server.', ephemeral: true });
        }

        // Check if the user has Administrator permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                content: 'You do not have the required permissions to set up the Discord automod system within this server.',
                ephemeral: true
            });
        }

        const sub = options.getSubcommand();
        if (sub === 'profile') {
            const word = options.getString('word');

            await interaction.reply({ content: '<a:Loading:1294279339361304608> Loading your flagged words automod rule...' });

            try {
                const rule = await guild.autoModerationRules.create({
                    name: `Prevent the word "${word}" in member profiles by Java Lava`,
                    creatorId: interaction.user.id, // Use the ID of the user executing the command
                    enabled: true,
                    eventType: 1, // MESSAGE_SEND
                    triggerType: 6, // KEYWORD
                    triggerMetadata: {
                        keywordFilter: [word]
                    },
                    actions: [
                        {
                            type: 4, // BLOCK_MEMBER_INTERACTION
                            metadata: {
                                channel: interaction.channel.id, // Channel ID instead of the object
                                durationSeconds: 10,
                                customMessage: 'This message was prevented by the Java Lava bot automod system.'
                            }
                        }
                    ]
                });

                const embed = new EmbedBuilder()
                    .setColor('Purple')
                    .setDescription(
                        `<:Verified:1089938149104427098> Your automod rule has been created. All members with the word "${word}" will not be able to chat by the Java Lava bot.`
                    );

                await interaction.editReply({ content: '', embeds: [embed] });
            } catch (err) {
                console.error(err);
                await interaction.editReply({
                    content: `An error occurred: ${err.message}.
                    Please report a screenshot of this error to the support server! https://discord.gg/tfSB4D4X 
                    If you are running this command a 2nd time or more then the automod rule can not be edited via the bot, you have to go onto desktop to edit the automod rule! OR your server is NOT marked community in server settings go to server settings, enable community, and run me again!`
                });
            }
        }
    }
};
