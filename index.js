const { Client, PermissionsBitField, Events } = require('discord.js');
const mongoose = require('mongoose');
const LogError = require('./utils/LogError.js')
const blacklist = require('./Schemas.js/blacklistuser.js');

const client = new Client({
    intents: [
        'Guilds',
        'GuildMembers',
        'GuildMessages',
        'DirectMessages',
        'GuildVoiceStates',
        'GuildPresences'
    ]
});

client.config = require('./config.json');
client.cooldowns = new Map();
client.cache = new Map();

// Each of these exports a function, it's the same as doing
// const ComponentLoader = require('./utils/ComponentLoader.js');
// ComponentLoader(client);
require('./utils/ComponentLoader.js')(client);
require('./utils/EventLoader.js')(client);
require('./utils/RegisterCommands.js')(client);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Here we connect to the database
// It has been moved outside of the ready event so we don't have to wait on discord
// [Application startup] -> [client.login()] -> [Discord responds] -> [Ready event] -> [Database connection]
//
// This way we can connect to the database while waiting for discord to respond
// [Application startup] -> [Database connection] -> [client.login()] -> [Discord responds] -> [Ready event]
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
( async function() {
	if (!client.config.mongoURL) return console.warn('MongoDB URL is not provided in the config.json file, skipping database connection...');
	await mongoose.connect(client.config.mongoURL);
})();

console.log(`Logging in...`);
client.login(client.config.TOKEN);
client.on('ready', function () {
    console.log(`Logged in as ${client.user.tag}!`);

	require('./utils/CheckIntents.js')(client);
});

client.on('messageCreate', () => {} )

async function InteractionHandler(interaction, type) {

    const component = client[type].get(interaction.customId ?? interaction.commandName);
    if (!component) return;


    //ADD DEV IDS HERE
    const devs = [
        '1163939796767473698',
        '579080596723335181'
    ];

    //command checking -> execution
    if (type === 'commands') {
        try {

            if (component.devCommand && !devs.includes(interaction.user.id)) return await interaction.reply({
                content: `Only **DEVELOPERS** can use this command`,
                ephemeral: true,
            });
            
            const data = await blacklist.findOne({ User: interaction.user.id });

            console.log(data)
            if (data) {
                return await interaction.reply({
                    content: `⚠️ You have been **BLACKLISTED** from using this bot!\nTo appeal, join the support server linked in my bio.`,
                    ephemeral: true
                });
            }
        } catch (error) {
            console.error("Error checking blacklist:", error);
        }
    }



    try {
        console.log(`[INTERACTION] ${interaction.user.tag} in ${interaction.guild ? interaction.guild.name : 'DMs'} triggered ${type} ${interaction.customId ?? interaction.commandName}`);
        //command properties
        if (component.admin) {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `⚠️ Only administrators can use this command!`, ephemeral: true });
        }

        if (component.owner) {
            if (interaction.user.id !== '1163939796767473698') return await interaction.reply({ content: `⚠️ Only bot owners can use this command!`, ephemeral: true });
        }

        await component.execute(interaction, client);
    } catch (error) {
        console.error(error);
		// If there is already a response, say after a deferReply(), we override the response with an error message.
        await interaction.deferReply({ ephemeral: true }).catch( () => {} );
        await interaction.editReply({
            content: `There was an error while executing this command!\n\`\`\`${error}\`\`\``,
            embeds: [],
            components: [],
            files: []
        }).catch( () => {} );
        LogError(error, client, `${type} ${interaction.customId ?? interaction.commandName}`);
    }
}

////////////////////////////////////////////////////////////////
// These are all the entry points for the interactionCreate event.
// This will run before any command processing, perfect for logs!
////////////////////////////////////////////////////////////////
client.on('interactionCreate', async function(interaction) {
    if (!interaction.isChatInputCommand()) return;
    await InteractionHandler(interaction, 'commands');
});

client.on('interactionCreate', async function(interaction) {
    if (!interaction.isButton()) return;
    await InteractionHandler(interaction, 'buttons');
});


client.on('interactionCreate', async function(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    await InteractionHandler(interaction, 'dropdowns');
});


client.on('interactionCreate', async function(interaction) {
    if (!interaction.isModalSubmit()) return;
    await InteractionHandler(interaction, 'modals');
});

const blacklistserver = require('./Schemas.js/blacklistserver');
client.on(Events.GuildCreate, async guild => {
    const data = await blacklistserver.findOne({ Guild: guild.id});

    if (!data) return;
    else {
        await guild.leave();
    }
    
})




//COMMAND PROPERTY EXAMPLES

        /*
            COMMAND PROPERTIES:

            module.exports = {
                admin: true,
                data: new SlashCommandBuilder()
                .setName('test')
                .setDescription('test'),
                async execute(interaction) { 
                
                }
            }

            You can use command properties in the module.exports statement by adding a valid property to : true,

            VALID PROPERTIES:

            admin : true/false
            owner : true/false
			dev: true/false

            You can add more command properties by following the prompt below and pasting it above in location with all the other statements:
            
            if (component.propertyname) {
                if (logic statement logic) return await interaction.reply({ content: `⚠️ response to flag`, ephemeral: true });
            }
        */