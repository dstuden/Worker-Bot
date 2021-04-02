const { MessageEmbed } = require('discord.js');

module.exports = function loop(message, serverQueue, loopQueue) {
    try {
        if (!message.member.voice.channel)
            return message.channel.send("You need to join the voice chat first");

        if (serverQueue.looping === true) {
            serverQueue.looping = false;
            loopQueue = [];
        }
        else if (serverQueue.looping === false) {
            serverQueue.looping = true;
            loopQueue = serverQueue.songs;
        }
        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(`looping set to **${serverQueue.looping}**`)
            .setFooter('PogWorks Studios ©️ 2021')
        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
    }
    catch (err) {
        console.log(err);
        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle('❌  Failed  ❌')
            .setFooter('PogWorks Studios ©️ 2021')

        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
    }
}