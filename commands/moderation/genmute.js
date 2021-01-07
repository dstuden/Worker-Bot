const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'genmute',
    category: 'moderation',
    description: 'Generates the MUTED role and permissions.',
    usage: `genmute`,
    run: async (client, message) => {
        if (message.member.hasPermission('MANAGE_ROLES')) {
            if (message.member.guild.roles.cache.find(role => role.name === "MUTED")) {

                const guildChannels = message.guild.channels.cache.array().filter(channel => channel.type === 'text');
                guildChannels.forEach(channel => {
                    channel.updateOverwrite(message.member.guild.roles.cache.find(role => role.name === "MUTED"), {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                        .then(channel => console.log(channel.permissionOverwrites.get(message.author.id)))
                        .catch(console.error);
                })

                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Generated channel settings for role MUTED!')

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

            } else {
                message.guild.roles.create({
                    data: {
                        name: 'MUTED',
                        color: 'GRAY',
                    },
                    reason: 'we needed a role for annoying People',
                });


                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Created role MUTED')

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

            }
        } else {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('You dont have the permissions to do that')

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        }

    }
}