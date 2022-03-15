const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'kick',
    category: 'moderation',
    description: 'kicks a user',
    usage: `kick`,
    run: async (client, message) => {
        if (!message.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS)) {
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
                        .kick(reason)
                        .then(() => {
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`Successfully kicked ${user.tag}`)
                                .addField(`Kicked by ${author}`, 'With the reason: ' + reason)

                            message.channel.send({ embeds: [embed] }).catch(err => console.error(err));
                        })
                        .catch(err => {
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`Failed to kick ${user.tag}`)

                            message.channel.send({ embeds: [embed] }).then(msg => {
                                message.delete()
                                setTimeout(() => msg.delete(), 10000)
                            }).catch(err => console.error(err));
                            console.error(err);
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