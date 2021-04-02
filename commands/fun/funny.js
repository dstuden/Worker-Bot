const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'funny',
    category: 'fun',
    description: 'returns a funny',
    usage: `funny`,
    run: async (client, message) => {
        function getRandomLine(filename) {
            var data = fs.readFileSync(filename, "utf8");
            var lines = data.split('\n');
            return lines[Math.floor(Math.random() * lines.length)];
        }
        var the_random_line_text = getRandomLine('./images/memes.txt');

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle('Peepo Pog Wow!')
            .setImage(the_random_line_text)
            .setFooter('PogWorks Studios ©️ 2021')

        message.channel.send(embed);
    }
}