const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'genmute',
    category: 'moderation',
    description: 'generates the MUTED role and permissions',
    usage: `genmute`,
    run: async (client, message) => {
        if (message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            if (!message.member.guild.roles.cache.find(role => role.name === "MUTED")) {// creates the role if it doesn't exist

                await message.guild.roles.create({
                    name: 'MUTED',
                    color: 'Cyan',
                    reason: 'we needed a role for annoying People',
                });
                //generate the perms for all text channels
                const guildChannels = message.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');
                guildChannels.forEach(channel => {
                    channel.permissionOverwrites.edit(message.member.guild.roles.cache.find(role => role.name === "MUTED"), {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                        .catch(console.error);
                })

            } else {
                //generate the perms for all text channels
                const guildChannels = message.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');
                guildChannels.forEach(channel => {
                    channel.permissionOverwrites.edit(message.member.guild.roles.cache.find(role => role.name === "MUTED"), {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false
                    })
                        .catch(console.error);
                })
            }

            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('Generated channel settings for role MUTED!')

            message.channel.send({ embeds: [embed] }).then(msg => {
                message.delete()
                setTimeout(() => msg.delete(), 10000)
            }).catch(err => console.error(err));
        } else {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('You dont have the permissions to do that')

            message.channel.send({ embeds: [embed] }).then(msg => {
                message.delete()
                setTimeout(() => msg.delete(), 10000)
            }).catch(err => console.error(err));
        }

    }
}