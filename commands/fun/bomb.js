const { MessageEmbed } = require('discord.js');
const talkedRecently = new Set();

module.exports = {
    name: 'bomb',
    category: 'fun',
    description: 'spam',
    usage: `bomb`,
    run: async (client, message) => {
        if (talkedRecently.has(message.author.id)) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('Please wait before using this command again!')

            message.channel.send({ embeds: [embed] }).then(msg => {
                message.delete()
                setTimeout(() => msg.delete(), 5000)
            }).catch(err => console.error(err));
        } else {
            if (!message.mentions.users.first()) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('No users mentioned!')

                return message.channel.send({ embeds: [embed] }).then(msg => {
                    message.delete()
                    setTimeout(() => msg.delete(), 5000)
                }).catch(err => console.error(err));
            }

            for (let i = 0; i < 5; i++) {
                message.channel.send(`${message.mentions.users.first()}`).catch(err => console.error(err));
            }
        }
        talkedRecently.add(message.member.id);

        setTimeout(() => {
            talkedRecently.delete(message.member.id);
        }, 10000);
    }
}
