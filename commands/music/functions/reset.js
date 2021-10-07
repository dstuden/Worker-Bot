const { MessageEmbed } = require('discord.js');
const lyricsFinder = require('lyrics-finder');

module.exports = function reset(message, serverQueue, queue) {
    try {
       
        serverQueue.connection.dispatcher.end();
        serverQueue = queue.get(message.guild.id);
        serverQueue.looping = false;
        serverQueue.songs = [];

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(`✅ Reset successful`)
        serverQueue.txtChannel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
    }
    catch (err) {
        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(`Reset failed!`)
            .setDescription('Please submit the issue on my github page.')
        serverQueue.txtChannel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        console.error(err);
    }
}
