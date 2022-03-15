const { MessageEmbed, Permissions } = require('discord.js');
const talkedRecently = new Set();

module.exports = {
    name: 'purge',
    category: 'moderation',
    description: 'deletes messages',
    usage: `purge`,
    run: async (client, message) => {
        if (message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
            if (talkedRecently.has(message.author.id)) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Please wait before using this command again!')

                message.channel.send({ embeds: [embed] }).then(msg => {
                    message.delete()
                    setTimeout(() => msg.delete(), 10000)
                }).catch(err => console.error(err));
            } else {

                let deleteNum = message.content.split(' ');

                if (deleteNum > 99) {
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('Unable to delete more than 100 messages!')

                    message.channel.send({ embeds: [embed] }).then(msg => {
                        message.delete()
                        setTimeout(() => msg.delete(), 10000)
                    }).catch(err => console.error(err));
                }

                message.channel.bulkDelete(parseInt(deleteNum[1]) + 1).catch(error => {
                    console.log(error)
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('Unable to delete messages older than 14 days!')

                    message.channel.send({ embeds: [embed] }).then(msg => {
                        message.delete()
                        setTimeout(() => msg.delete(), 10000)
                    }).catch(err => console.error(err));
                });

                talkedRecently.add(message.member.id);
                setTimeout(() => {

                    talkedRecently.delete(message.member.id);
                }, 5000);
            }
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