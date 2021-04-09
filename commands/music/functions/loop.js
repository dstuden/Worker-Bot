const { MessageEmbed } = require('discord.js');

module.exports = function loop(message, serverQueue) {
    try {
        if (!message.member.voice.channel)
            return message.channel.send("You need to join the voice chat first");

        if (serverQueue.looping === true) {
            serverQueue.looping = false;
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`🛑 no longer looping the queue`)
                .setFooter('PogWorks Studios ©️ 2021')
            message.channel.send(embed).then(m => m.delete({ timeout: 30000 })).catch(err => console.error(err));
        }
        else if (serverQueue.looping === false) {
            serverQueue.looping = true;
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('🔄 now looping the queue')
                .setFooter('PogWorks Studios ©️ 2021')
            message.channel.send(embed).then(m => m.delete({ timeout: 30000 })).catch(err => console.error(err));
        }
    }
    catch (err) {
        console.log(err);
        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle('❗ nothing to loop ❗')
            .setFooter('PogWorks Studios ©️ 2021')

        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
    }
}