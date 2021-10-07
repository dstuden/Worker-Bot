const { MessageEmbed } = require('discord.js');
const lyricsFinder = require('lyrics-finder');

module.exports = function reset(message, queue, serverQueue, _queueIndex) {
    try {
        serverQueue.looping = false;
        serverQueue.songs = [];
        queueIndex = 0;
        queue.delete(message.guild.id); // aaaaaaaaaaaaa fucking christ im braindead
        message.guild.me.voice.channel.leave();

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(`✅ Reset successful`)
        return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
    }
    catch (err) {
        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(`Reset failed!`)
            .setDescription('Please submit the issue on my github page.')
        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        console.error(err);
    }
}
