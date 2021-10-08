const { MessageEmbed } = require('discord.js');

module.exports = function stop(message, queue, serverQueue, _queueIndex) {
    try {
        if (!message.member.voice.channel)
            return message.channel.send("You need to join the voice chat first!");

        serverQueue.looping = false;
        serverQueue.songs = [];
        queueIndex = 0;
        queue.delete(message.guild.id); // aaaaaaaaaaaaa fucking christ im braindead
        message.guild.me.voice.channel.leave();

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(`✅  Disconnected`)
        serverQueue.txtChannel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
    }
    catch (err) {
        console.log(err)
        
        if (!message.guild.me.voice.channel) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`✅ Queue cleared`)
            return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        }
        else {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`Disconnect  failed!`)
                .setDescription('Please submit the issue on my github page.')
            return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        }
    }
}