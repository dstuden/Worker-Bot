const { MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'surface',
    category: 'moderation',
    description: 'returns a user from the abyss',
    usage: `surface`,
    run: async (client, message) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`You don't have the permissions to do that!`)

            message.channel.send({ embeds: [embed] }).then(msg => {
                message.delete()
                setTimeout(() => msg.delete(), 10000)
            }).catch(err => console.error(err));
        } else {
            const user = message.mentions.users.first();

            if (user) {

                const member = message.guild.members.resolve(user);
                const author = message.member.user.tag;
                let reason = message.content.split(' ').slice(1);
                reason = reason.slice(1).join(' ');

                if (member) {

                    member.roles.remove(message.guild.roles.cache.find(r => r.name === "ABYSS")).catch(err => console.error(err))
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle(`${user.tag} is no longer in the abyss!`)
                        .addField(`Surfaced by ${author}`, 'With the reason: ' + reason)

                    message.channel.send({ embeds: [embed] }).catch(err => console.error(err));
                } else {
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle(`Unknown user!`)

                    message.channel.send({ embeds: [embed] }).then(msg => {
                        message.delete()
                        setTimeout(() => msg.delete(), 10000)
                    }).catch(err => console.error(err));
                }
            } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle(`No users were mentioned!`)

                message.channel.send({ embeds: [embed] }).then(msg => {
                    message.delete()
                    setTimeout(() => msg.delete(), 10000)
                }).catch(err => console.error(err));
            }
        }
    }
}
