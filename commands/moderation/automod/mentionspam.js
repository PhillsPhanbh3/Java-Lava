const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('automod-spam')
    .setDescription('setup the mention spam automod system')
    .addSubcommand( command => command.setName('mentions').setDescription('Block messages suspected of mention spam').addIntegerOption(option => option.setName('number').setDescription('The number of mentions required to block a message').setRequired(true))),
    async execute (interaction) {

        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'you do not have the required perms to set up the discord automod system within this server', ephermal: true})
        
            switch (sub) {
                case 'mentions':
                
                await interaction.reply({ content: '<a:Loading:1294279339361304608> Loading your flagged words automod rule...'});
                const word = options.getInteger('number');

                const rule = await guild.autoModerationRules.create({
                    name: `Prevent spam mentions by Java Lava`,
                    creatorId: '1305190785536360519',
                    enabled: true,
                    eventType: 1,
                    triggerType: 5,
                    triggerMetadata:
                    {
                        mentionTotalLimit: Number
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
                    .setDescription(`<:Verified:1320110619705475072> Your automod rule has been created, all messages of mention spam will be stopped by Java Lava bot`)

                    await interaction.editReply({ contnet: '', embeds: [embed] });
                }, 3000)
            }
    }
}