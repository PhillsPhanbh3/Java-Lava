const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


const staffRoleId = '1334687755241787423'; // Replace with actual staff role ID
const staffChannelId = '1337875742175924284'; // Replace with actual channel ID

const statusEmojis = {
    online: '<:Online:1340414232679813191>',
    idle: '<:IDLE:1340414216292532295>',
    dnd: '<:Do_Not_Disturb:1340414202942066780>',
    offline: '<:Offline:1340414189109248040>'
};

let previousStatuses = {}; // Track previous statuses
let staffMessageId = null; // Store the message ID

module.exports = {
    devCommand: true,
    data: new SlashCommandBuilder()
        .setName('dev-staff-availability')
        .setDescription('Displays available and unavailable staff members'),

    async execute(interaction) {

        const guild = interaction.guild;
        await guild.members.fetch(); // Ensure fresh member data

        const staffMembers = guild.members.cache.filter(member =>
            member.roles.cache.has(staffRoleId)
        );

        const generateEmbed = () => {
            const availableStaff = [];
            const unavailableStaff = [];

            staffMembers.forEach(member => {
                const presence = member.presence?.status || 'offline';
                const mention = `<@${member.id}>`;

                previousStatuses[member.id] = presence; // Store presence status

                if (['online', 'idle', 'dnd'].includes(presence)) {
                    availableStaff.push(`${statusEmojis[presence]} ${mention}`);
                } else {
                    unavailableStaff.push(`${statusEmojis.offline} **${member.user.username}**`);
                }
            });

            return new EmbedBuilder()
                .setTitle('Available Staff')
                .setColor(0x5865F2)
                .setDescription(
                    availableStaff.length > 0
                        ? availableStaff.join('\n')
                        : '```No staff member is currently available.```'
                )
                .addFields({
                    name: 'Unavailable Staff',
                    value: unavailableStaff.length > 0 ? unavailableStaff.join('\n') : '*None*',
                    inline: false
                })
                .setFooter({ text: `Last Updated • ${new Date().toLocaleTimeString()}` });
        };

        // Send the initial embed and store the message ID
        const staffChannel = guild.channels.cache.get(staffChannelId);
        if (!staffChannel) {
            return interaction.reply({
                content: "❌ **The staff channel was not found.**",
                ephemeral: true
            });
        }

        const sentMessage = await staffChannel.send({ embeds: [generateEmbed()] });
        staffMessageId = sentMessage.id; // Store the message ID

        await interaction.reply({
            content: `✅ **Staff availability posted in ${staffChannel}.**`,
            ephemeral: true
        });

        // Check every 90 seconds (90,000ms) for status changes and edit the message if needed
        setInterval(async () => {
            await guild.members.fetch(); // Refresh members cache
            let statusChanged = false;

            const updatedStaffMembers = guild.members.cache.filter(member =>
                member.roles.cache.has(staffRoleId)
            );

            updatedStaffMembers.forEach(member => {
                const newPresence = member.presence?.status || 'offline';
                if (previousStatuses[member.id] !== newPresence) {
                    previousStatuses[member.id] = newPresence;
                    statusChanged = true;
                }
            });

            if (statusChanged && staffMessageId) {
                try {
                    const staffMessage = await staffChannel.messages.fetch(staffMessageId);
                    await staffMessage.edit({ embeds: [generateEmbed()] });
                    console.log('✅ Staff availability message updated.');
                } catch (error) {
                    console.error('❌ Failed to edit message:', error);
                }
            }
        }, 90000); // Run every 90 seconds
    }
};
