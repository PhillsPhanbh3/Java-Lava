const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('automod-profanity-and')
    .setDescription('Setup the automod system')
    .addSubcommand(command => command.setName('slurs').setDescription('Block profanity and slurs')),
    async execute (interaction) {

        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'you do not have the required permission **ADMINISTRATOR** to set up the discord automod system within this server', ephermal: true})

            switch (sub) {
                case 'slurs':

                await interaction.reply({ content: '<a:Loading:1294279339361304608> Loading your automod rule'});

                const rule = await guild.autoModerationRules.create({
                    name: 'Block profanity and slurs by Java Lava',
                    creatorId: '1305190785536360519',
                    enabled: true,
                    eventType: 1,
                    triggerType: 4,
                    triggerMetadata:
                    {
                        presets: [1, 3]
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: `This message was prevented by Java Lava auto moderation system`
                            }
                        }
                    ]
                }).catch(async err => {
                    setTimeout(async () => {
                        console.log(err);
                        await interaction.editReply({ content: `${err}
                            please report a screenshot of this error to the support server! https://discord.gg/tfSB4D4X`})
                    }, 2000)
                })

                setTimeout(async () => {
                    if (!rule) return;

                    const embed = new EmbedBuilder()
                    .setColor("Blurple")
                    .setDescription('<:Verified:1320110619705475072> Your automod rule has been created, all messages containing profanity, and slurs will be blocked by Java Lava')

                    await interaction.editReply({ content: '', embeds: [embed]})
                }, 3000)
            }
    }
}