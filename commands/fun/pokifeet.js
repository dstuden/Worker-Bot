const { MessageEmbed } = require('discord.js');
const wikifeet = require('wikifeet-js');
const talkedRecently = new Set();

module.exports = {
    name: 'pokifeet',
    category: 'fun',
    description: 'lewd...',
    usage: `pokifeet`,
    run: async (client, message) => {

        if (talkedRecently.has(message.author.id)) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('Please wait before using this command again!')

            message.channel.send(embed).then(m => m.delete({ timeout: 5000 })).catch(err => console.error(err));
        } else {
            let pokimane = (await wikifeet.search('pokimane'))[0];
            let pics = await wikifeet.getImages(pokimane);
            let random = 0 | (pics.length * Math.random());

            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('Enjoy :wink: ')
                .setImage(`${pics[random]}`)

            message.channel.send(embed).catch(err => console.error(err));

            talkedRecently.add(message.member.id);
            setTimeout(() => {

                talkedRecently.delete(message.member.id);
            }, 5000);
        }

    }
}