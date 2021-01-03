const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'say',
    category: 'fun',
    description: 'say things',
    usage: `say`,
    run: async (client, message) => {
        const content = message.content.split(' ').slice(1).join(' ');
        message.delete().catch(err => console.error(err));
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