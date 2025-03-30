const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const vccreate = require('../../../Schemas.js/vccreate.js');
const vccreateuser = require('../../../Schemas.js/vccreateuser.js');
const wordFilter = require('mrjbadwordfilter');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('vc-create-system')
    .setDescription('Create a VC')
    .addSubcommand(command => command.setName('setup').setDescription('Setup the custom TEMP VC system!').addChannelOption(option => option.setName('channel').setDescription('The VC to be your join to create vc channel (to make the user their own vc)').addChannelTypes(ChannelType.GuildVoice).setRequired(true)).addStringOption(option => option.setName('name').setDescription('The name of your vc create channel!').setRequired(true)).addIntegerOption(option => option.setName('limit').setDescription('The limit for your VCs').setMinValue(1).setMaxValue(99))),
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
            case 'setup':
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await sendMessage(`<:alarm:1319759699867996220> Only users with the **ADMINISTRATOR** permission can use this command!`);
                if (serverData) return await sendMessage(`<a:alarmbell:1345763276608503888> This system is already setup here`);
                else {
                    const channel = options.getChannel('channel');
                    const name = options.getString('name');
                    const limit = options.getInteger('limit');

                    await vccreate.create({
                        Guild: interaction.guild.id,
                        Channel: channel.id,
                        Name: name,
                        Limit: limit,
                        Category: channel.parentId
                    });

                    await sendMessage(`🌎 I have setup the join to create system in ${channel}`);
                }
        }
    }
}