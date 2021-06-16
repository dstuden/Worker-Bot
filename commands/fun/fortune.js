const { MessageEmbed } = require('discord.js');
const fs = require('fs');
var tfortune = require('tfortune');

module.exports = {
    name: 'fortune',
    category: 'fun',
    description: 'shitty unix fortune',
    usage: `fortune`,
    run: async (client, message) => {
        var options = {};

        tfortune(options, function (err, a) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .addField(a, '‎')
                    .setFooter('PogWorks Studios ©️ 2021')
        
                message.channel.send(embed).catch(err => console.log(err));
        });
    }
}
