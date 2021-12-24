const { MessageEmbed } = require('discord.js');

module.exports = function skip(message, serverQueue) {
    try {
        if (!message.member.voice.channel)
            return message.channel.send("You need to join the voice chat first");

        let embed = new MessageEmbed()
            .setColor(process.env.COLOR)

        if (!serverQueue.muted) {
            embed.setTitle('🔇 Muted notifications! 🔇');
            serverQueue.muted = true;
        }
        else {
            embed.setTitle('📢 Unmuted notifications! 📢');
            serverQueue.muted = false;
        }
        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

    }
    catch (err) {
        message.guild.me.voice.channel.leave();

        console.log(err);
        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle('❌  Failed because Heroku is poop  ❌')

        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
    }
}