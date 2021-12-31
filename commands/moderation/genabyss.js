const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'genabyss',
    category: 'moderation',
    description: 'generates the ABYSS role and permissions',
    usage: `genabyss`,
    run: async (client, message) => {
        if (message.member.hasPermission('MANAGE_ROLES')) {
            if (!message.member.guild.roles.cache.find(role => role.name === "ABYSS")) { // creates the role if it doesn't exist

                await message.guild.roles.create({
                    data: {
                        name: 'ABYSS',
                        color: 'BLACK',
                    },
                    reason: 'we needed a role for super annoying People',
                });
                //generate the perms for all text channels
                const guildChannelsText = message.guild.channels.cache.array().filter(channel => channel.type === 'text');
                guildChannelsText.forEach(channel => {
                    channel.updateOverwrite(message.member.guild.roles.cache.find(role => role.name === "ABYSS"), {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false
                    })
                        .catch(console.error);
                })
                //generate the perms for all voice channels
                const guildChannelsVoice = message.guild.channels.cache.array().filter(channel => channel.type === 'voice');
                guildChannelsVoice.forEach(channel => {
                    channel.updateOverwrite(message.member.guild.roles.cache.find(role => role.name === "ABYSS"), {
                        CONNECT: false,
                        VIEW_CHANNEL: false
                    })
                        .then(channel => console.log(channel.permissionOverwrites.get(message.author.id)))
                        .catch(console.error);
                })

            } else {
                //generate the perms for all text channels
                const guildChannelsText = message.guild.channels.cache.array().filter(channel => channel.type === 'text');
                guildChannelsText.forEach(channel => {
                    channel.updateOverwrite(message.member.guild.roles.cache.find(role => role.name === "ABYSS"), {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false
                    })
                        .catch(console.error);
                })
                //generate the perms for all voice channels
                const guildChannelsVoice = message.guild.channels.cache.array().filter(channel => channel.type === 'voice');
                guildChannelsVoice.forEach(channel => {
                    channel.updateOverwrite(message.member.guild.roles.cache.find(role => role.name === "ABYSS"), {
                        CONNECT: false,
                        VIEW_CHANNEL: false
                    })
                        .catch(console.error);
                })
            }
            
            const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Generated channel settings for role ABYSS!')

                message.channel.send(embed).catch(err => console.error(err));

        } else {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('You dont have the permissions to do that')

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        }
    }
}