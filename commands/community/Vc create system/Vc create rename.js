const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const vccreate = require('../../../Schemas.js/vccreate.js');
const vccreateuser = require('../../../Schemas.js/vccreateuser.js');
const wordFilter = require('mrjbadwordfilter');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vc-create')
        .setDescription('Create a VC')
        .addSubcommand(command => 
            command
                .setName('rename')
                .setDescription('Rename your custom temporary voice channel!')
                .addStringOption(option => 
                    option
                        .setName('name')
                        .setDescription('The new name for your voice channel')
                        .setRequired(true)
                )
        ),
    async execute (interaction) {

        const { options } = interaction;
        const sub = options.getSubcommand();
        const serverData = await vccreate.findOne({ Guild: interaction.guild.id});

        async function sendMessage (message) {
            const embed = new EmbedBuilder()
            .setColor("Purple")
            .setDescription(message);

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        switch (sub) {
            case 'rename':
                const userData = await vccreateuser.findOne({ User: interaction.user.id, Guild: interaction.guild.id});
                if (!userData) return await sendMessage(`<a:alarmbell:1345763276608503888> You do not own a VC`);
                else {
                    const rename = options.getString('name');

                    const check = await wordFilter(rename);
                    if (check) return await sendMessage(`<a:alarmbell:1345763276608503888> The name \`${rename}\` has a blacklisted word/term`);

                    const vc = await interaction.guild.channels.fetch(userData.Channel);
                    if (!vc) return await sendMessage(`<a:alarmbell:1345763276608503888> You do not own that vc anymore`);

                    try {
                        await vc.setName(rename);
                        await sendMessage(`🌎 Your vc is now called ${rename}`);
                    } catch (e) {
                        console.error(e);
                        await sendMessage(`<a:alarmbell:1345763276608503888> Something went wrong! please alert the support server by using /support`);
                    }
                }
        }
    }
}