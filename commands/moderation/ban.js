const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'ban',
    category: 'moderation',
    description: 'bans a user',
    usage: `ban`,
    run: async (client, message) => {
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`You don't have the permissions to do that!`)

            message.channel.send({ embeds: [embed] }).then(msg => {
                message.delete()
                setTimeout(() => msg.delete(), 10000)
            }).catch(err => console.error(err));
        } else {
            const user = message.mentions.users.first();
            const author = message.member.user.tag;

            if (user) {

                const member = message.guild.members.resolve(user);

                if (member) {
                    let reason = message.content.split(' ').slice(1);
                    reason = reason.slice(1).join(' ');
                    member
                        .ban({
                            reason: reason,
                        })
                        .then(() => {
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`Successfully banned ${user.tag}`)
                                .addField(`Banned by ${author}`, 'With the reason: ' + reason)

                            message.channel.send({ embeds: [embed] }).then(msg => {
                                message.delete()
                                setTimeout(() => msg.delete(), 10000)
                            }).catch(err => console.error(err));

                        })
                        .catch(err => {
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`Failed to ban ${user.tag}`)

                            message.channel.send({ embeds: [embed] }).then(msg => {
                                message.delete()
                                setTimeout(() => msg.delete(), 10000)
                            }).catch(err => console.error(err));
                        });
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