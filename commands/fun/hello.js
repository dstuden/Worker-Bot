const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'hello',
    category: 'fun',
    description: 'hello',
    usage: `hello`,
    run: async (client, message) => {

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle('Hello!')
            .setImage('https://i.pinimg.com/originals/03/68/c2/0368c21a37cce3e3628ff8eeccc4e2a4.gif')

        message.channel.send({ embeds: [embed] }).catch(err => console.error(err));
    }
}
