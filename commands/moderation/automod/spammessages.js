const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('automod-spam-message')
    .setDescription('setup the spam messages automod system with the block messages suspected of spam')
    .addSubcommand( command => command.setName('alerts').setDescription('Block messages suspected of spam')),
    async execute (interaction) {

        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'you do not have the required perms to set up the discord automod system within this server', ephermal: true})
        
            switch (sub) {
                case 'messages-alerts':
                
                await interaction.reply({ content: '<a:Loading:1294279339361304608> Loading your flagged words automod rule...'});
                const word = options.getString('word');

                const rule = await guild.autoModerationRules.create({
                    name: `Prevent the word ${word} from being used by Java Lava`,
                    creatorId: '1305190785536360519',
                    enabled: true,
                    eventType: 1,
                    triggerType: 3,
                    triggerMetadata:
                    {
                        //mentionTotalLimit: Number
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: 'This message was prevented by Java lava bot automod system'
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
                    .setColor('Purple')
                    .setDescription(`<:Verified:1089938149104427098> Your automod rule has been created, all messages containing the word ${word} will be stopped by Java Lava bot`)

                    await interaction.editReply({ contnet: '', embeds: [embed] });
                }, 3000)
            }
    }
}