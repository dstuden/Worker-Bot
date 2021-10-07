const { MessageEmbed } = require('discord.js');
const lyricsFinder = require('lyrics-finder');

module.exports = function reset(message, queue) {
    try {
        message.guild.me.voice.channel.leave();
        queue.delete(message.guild.id); // aaaaaaaaaaaaa fucking christ im braindead

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(`✅ Reset successful`)
            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
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
