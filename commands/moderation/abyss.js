const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
    name: 'abyss',
    category: 'moderation',
    description: 'sends a user into the abyss',
    usage: `abyss`,
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
            const author = message.member.user.tag;

            if (message.member.guild.roles.cache.find(role => role.name === "ABYSS")) {
                if (user) {

                    const member = message.guild.members.resolve(user);
                    let reason = message.content.split(' ').slice(1);
                    reason = reason.slice(1).join(' ');

                    if (member) {
                        member.roles.add(message.guild.roles.cache.find(r => r.name === "ABYSS")).catch(err => console.error(err));
                        const embed = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle(`${user.tag} is now in the abyss!`)
                            .addField(`Sent into the abyss by ${author}`, 'With the reason: ' + reason)

                        message.channel.send({ embeds: [embed] }).then(msg => {
                            message.delete()
                            setTimeout(() => msg.delete(), 10000)
                        }).catch(err => console.error(err));

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

            } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle(`Please use \`$genabyss\` first!`)

                    message.channel.send({ embeds: [embed] }).then(msg => {
                        message.delete()
                        setTimeout(() => msg.delete(), 10000)
                    }).catch(err => console.error(err));
            }
        }
    }
}
