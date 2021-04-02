const { MessageEmbed } = require('discord.js');

module.exports=function queueList(message, serverQueue) {
    try {
        if (!message.member.voice.channel) return message.channel.send("You need to join the voice chat first");

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle('⏭️  Queue')
            .setFooter('PogWorks Studios ©️ 2021')
        for (var i = 0; (i < serverQueue.songs.length) && (i < 10); i++) {
            embed.addField('‏‏‎ ‎', `${i + 1}. [${serverQueue.songs[i].title}](${serverQueue.songs[i].url})...`);
        }

        message.channel.send(embed).then(m => m.delete({ timeout: 30000 })).catch(err => console.error(err));

    }
    catch (err) {
        console.log(err)
    }
}
