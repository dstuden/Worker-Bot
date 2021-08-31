const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'unmute',
    category: 'moderation',
    description: 'Unmutes a user.',
    usage: `unmute`,
    run: async (client, message) => {
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`you don't have the permissions to do that`)
                .setFooter('PogWorks Studios ©️ 2021')

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        } else {
            const user = message.mentions.users.first();
            const author = message.member.user.tag;
            let reason = message.content.split(' ').slice(1);
            reason = reason.slice(1).join(' ');

            if (user) {

                const member = message.guild.members.resolve(user);
                let reason = message.content.split(' ').slice(1);
                reason = reason.slice(1).join(' ');

                if (member) {

                    member.roles.remove(message.guild.roles.cache.find(r => r.name === "MUTED")).catch(err => console.error(err));
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle(`${user.tag} is no longer muted!`)
                        .addField(`Unmuted by ${author}`, 'With the reason: ' + reason)
                        .setFooter('PogWorks Studios ©️ 2021')

                    message.channel.send(embed).catch(err => console.error(err));

                } else {
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle(`Unknown user!`)
                        .setFooter('PogWorks Studios ©️ 2021')

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                }
            } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle(`No users were mentioned!`)
                    .setFooter('PogWorks Studios ©️ 2021')

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

            }
        }
    }
}
