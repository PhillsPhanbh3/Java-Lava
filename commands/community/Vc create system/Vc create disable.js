const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const vccreate = require('../../../Schemas.js/vccreate.js');
const vccreateuser = require('../../../Schemas.js/vccreateuser.js');
const wordFilter = require('mrjbadwordfilter');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('vc')
    .setDescription('Create a VC')
    .addSubcommand(command => command.setName('create-disable').setDescription('Disable the custom TEMP VC system!')),
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
            case 'disable':
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await sendMessage(`<:alarm:1319759699867996220> Only users with the **ADMINISTRATOR** permission can use this command!`);
                if (serverData) return await sendMessage(`<a:alarmbell:1345763276608503888> This system is **NOT** already setup here`);
                else {
                    await vccreate.deleteOne({ Guild: interaction.guild.id });
                    await sendMessage(`🌎 I have disabled the join vc system`);
                }
        }
    }
}