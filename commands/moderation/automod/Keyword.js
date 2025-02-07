const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod-custom')
        .setDescription('Setup custom words to be prevented by the AutoMod system')
        .addSubcommand(command => 
            command.setName('word')
                .setDescription('Block custom word')
                .addStringOption(option => 
                    option.setName('word')
                        .setDescription('The word you want to block')
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ 
                content: 'You do not have the required permissions to set up the AutoMod system in this server.', 
                ephemeral: true 
            });
        }

        switch (sub) {
            case 'word':
                await interaction.reply({ content: '<a:Loading:1294279339361304608> Loading your flagged words AutoMod rule...' });
                const word = options.getString('word');

                const rule = await guild.autoModerationRules.create({
                    name: `Block the word "${word}" by Java Lava`,
                    enabled: true,
                    eventType: 1, // MESSAGE_SEND
                    triggerType: 1, // KEYWORD
                    triggerMetadata: {
                        keywordFilter: [word] // Correct property for custom words
                    },
                    actions: [
                        {
                            type: 1, // BLOCK_MESSAGE
                            metadata: {
                                channel: interaction.channel.id, // Use channel ID
                                durationSeconds: 10,
                                customMessage: 'This message was prevented by Java Lava AutoMod system.'
                            }
                        }
                    ]
                }).catch(async (err) => {
                    console.error(err);
                    await interaction.editReply({ 
                        content: `An error occurred: ${err.message}
Please report this in the support server! https://discord.gg/tfSB4D4X` 
                    });
                });

                if (rule) {
                    const embed = new EmbedBuilder()
                        .setColor('Blurple')
                        .setDescription(`<:Verified:1320110619705475072> Your AutoMod rule has been created. All messages containing the word "${word}" will be blocked by Java Lava.`);

                    await interaction.editReply({ content: '', embeds: [embed] });
                }
                break;
        }
    }
};
