const { MessageEmbed } = require('discord.js');
const lyricsFinder = require('lyrics-finder');

module.exports = async function lyrics(message, serverQueue, queueIndex) {
    if (!message.member.voice.channel)
        return message.channel.send("You need to join the voice chat first!");
    try {
        let lyrics = await lyricsFinder(serverQueue.songs[queueIndex].artist, serverQueue.songs[queueIndex].name) || serverQueue.txtChannel.send('Nothing found ❗');
        lyrics = lyrics.split(/\n{2,}/g);

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle('get rick rolled :joy:')
            .setFooter('PogWorks Studios ©️ 2021')

        for (var i = 0; i < lyrics.length; i++) {
            embed.addField('‏‏‎ ‎', lyrics[i]);
        }

        serverQueue.txtChannel.send(embed).catch(err => console.error(err));

    }
    catch (err) {
        console.log(err)
    }
}