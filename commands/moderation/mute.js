const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'mute',
    category: 'moderation',
    description: 'Mutes a user.',
    usage: `mute`,
    run: async (client, message) => {
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`You don't have the permissions to do that!`)

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        } else {
            if (message.member.guild.roles.cache.find(role => role.name === "MUTED")) {
                const user = message.mentions.users.first();

                if (user) {

                    const member = message.guild.members.resolve(user);

                    if (member) {

                        member.roles.add(message.guild.roles.cache.find(r => r.name === "MUTED")).catch(err => console.error(err));
                        const embed = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle(`${user.tag} is now muted!`)

                        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

                    } else {
                        const embed = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle(`Unknown user!`)

                        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                    }
                } else {
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle(`No users were mentioned!`)

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

                }
            } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle(`Please generate the MUTED role first!`)

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
            }
        }
    }
}