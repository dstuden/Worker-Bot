const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'say',
    category: 'fun',
    description: 'say things + you can use "say embed" to use embeds',
    usage: 'say',
    run: async (client, message) => {
        let content = message.content.split(' ').slice(1).join(' ');
        const check = content.split(' ');

        message.delete().catch(err => console.error(err));

        if (check[0] == 'embed') {
            content = content.split(' ').slice(1).join(' ')
            if (content.length == 0) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Enter the message!')
                message.channel.send(embed).then(m => m.delete({ timeout: 5000 })).catch(err => console.error(err));
            }
            else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle(content)
                message.channel.send(embed).catch(err => console.error(err));
            }
        } else {
            if (content.length == 0) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Enter the message!')
                message.channel.send(embed).then(m => m.delete({ timeout: 5000 })).catch(err => console.error(err));
            }
            else {
                message.channel.send(content).catch(err => console.error(err));
            }
        }
    }
}