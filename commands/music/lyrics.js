const { MessageEmbed } = require('discord.js');
const lyricsFinder = require('lyrics-finder');

module.exports = async function lyrics(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("You need to join the voice chat first!");
    try {

        let lyrics = await lyricsFinder(serverQueue.songs[0].artist, serverQueue.songs[0].name) || serverQueue.txtChannel.send('Nothing found ❗');
        lyrics = lyrics.split(/\n{2,}/g);

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(`${serverQueue.songs[0].title}`)
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