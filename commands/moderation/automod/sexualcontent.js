const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('automod-sexual')
    .setDescription('Setup the automod system')
    .addSubcommand(command => command.setName('content').setDescription('Block sexual content ONLY via Java Lava auto moderation system')),
    async execute (interaction) {

        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You do not have the required permission **ADMINISTRATOR** in order to set up the automod system within this server', ephermal: true})

            switch (sub) {
            case 'content':

            await interaction.reply({ content: '<a:Loading:1294279339361304608> Loading your automod rule'});

            const rule = await guild.autoModerationRules.create({
                name: `Block sexual content by Java Lava`,
                creatorId: '1305190785536360519',
                enabled: true,
                eventType: 1,
                triggerType: 4,
                triggerMetadata:
                {
                presets: [2]
                },
            actions: [
                {
                    type: 1,
                    metadata: {
                    channel: interaction.channel,
                    durationSeconds:10,
                    customMessage: `This message was prevented by Java Lava auto moderation system`
                            }
                        }
                    ]
                }).catch(async err => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({ content: `${err}
                            please report a screenshot of this error to the support server! https://discord.gg/tfSB4D4X`});
                    }, 2000)
                })

                setTimeout(async () => {
                    if (!rule) return;

                    const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription('<:Verified:1320110619705475072> Your automod rule has been created, all messages containing sexual content will be blocked by Java Lava')

                    await interaction.editReply({ content: '', embeds: [embed]})
                }, 3000)
            }
    }
}