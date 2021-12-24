const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'genmute',
    category: 'moderation',
    description: 'generates the MUTED role and permissions',
    usage: `genmute`,
    run: async (client, message) => {
        if (message.member.hasPermission('MANAGE_ROLES')) {
            if (!message.member.guild.roles.cache.find(role => role.name === "MUTED")) {// creates the role if it doesn't exist

                await message.guild.roles.create({
                    data: {
                        name: 'MUTED',
                        color: 'GRAY',
                    },
                    reason: 'we needed a role for annoying People',
                });
                //generate the perms for all text channels
                const guildChannels = message.guild.channels.cache.array().filter(channel => channel.type === 'text');
                guildChannels.forEach(channel => {
                    channel.updateOverwrite(message.member.guild.roles.cache.find(role => role.name === "MUTED"), {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                        .catch(console.error);
                })

            } else {
                //generate the perms for all text channels
                const guildChannels = message.guild.channels.cache.array().filter(channel => channel.type === 'text');
                guildChannels.forEach(channel => {
                    channel.updateOverwrite(message.member.guild.roles.cache.find(role => role.name === "MUTED"), {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                        .catch(console.error);
                })
            }

            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('Generated channel settings for role MUTED!')

            message.channel.send(embed).catch(err => console.error(err));

        } else {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('You dont have the permissions to do that')

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        }

    }
}