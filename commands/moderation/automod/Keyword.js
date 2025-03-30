const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('automod-custom')
    .setDescription('setup custom words to be prevented by the automod system with the block messages suspected of spam')
    .addSubcommand( command => command.setName('word').setDescription('Block custom word').addStringOption(option => option.setName('word').setDescription('The word you want to block').setRequired(true))),
    async execute (interaction) {

        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'you do not have the required perms to set up the discord automod system within this server', ephermal: true})
        
            switch (sub) {
                case 'words':
                
                await interaction.reply({ content: '<a:Loading:1294279339361304608> Loading your flagged words automod rule...'});
                const word = options.getString('word');

                const rule = await guild.autoModerationRules.create({
                    name: `Block the word ${word} by Java Lava`,
                    creatorId: '1305190785536360519',
                    enabled: true,
                    eventType: 1,
                    triggerType: 1,
                    triggerMetadata:
                    {
                        presets: [`${word}`]
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
                    .setDescription(`<:Verified:1320110619705475072> Your automod rule has been created, all messages containing the word ${word} will be blocked by Java Lava`)

                    await interaction.editReply({ content: '', embeds: [embed]})
                }, 3000)
            }
    }
}