const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'userdel',
    category: 'moderation',
    description: 'kicks a user',
    usage: `userdel`,
    run: async (client, message) => {
        if (!message.member.hasPermission('KICK_MEMBERS')) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`You don't have the permissions to do that!`)
                .setFooter('PogWorks Studios ©️ 2021')

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        } else {
            const user = message.mentions.users.first();
            const author = message.member.user.tag;
            if (user) {
                const member = message.guild.members.resolve(user);
                if (member) {
                    let reason = message.content.split(' ').slice(1);
                    reason = reason.slice(1).join(' ');
                    member
                        .kick(reason)
                        .then(() => {
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`Successfully kicked ${user.tag}`)
                                .addField(`Kicked by ${author}`, 'With the reason: ' + reason)
                                .setFooter('PogWorks Studios ©️ 2021')

                            message.channel.send(embed).catch(err => console.error(err));
                        })
                        .catch(err => {
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`Failed to kick ${user.tag}`)
                                .setFooter('PogWorks Studios ©️ 2021')

                            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

                            console.error(err);
                        });
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

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 }))
            }

        }
    }
}