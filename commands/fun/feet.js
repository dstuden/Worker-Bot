const { MessageEmbed } = require('discord.js');
const wikifeet = require('wikifeet-js');
const talkedRecently = new Set();

module.exports = {
    name: 'feet',
    category: 'fun',
    description: 'lewd...',
    usage: `feet <name>`,
    run: async (client, message) => {

        try {
            if (talkedRecently.has(message.author.id)) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Please wait before using this command again!')

                message.channel.send(embed).then(m => m.delete({ timeout: 5000 })).catch(err => console.error(err));
                return;
            }
            const query = message.content.split(' ')?.slice(1)?.join(' ');

            if (!query) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('No query!')

                message.channel.send(embed).then(m => m.delete({ timeout: 5000 })).catch(err => console.error(err));
                return;
            }


            let person = (await wikifeet.search(query))[0];
            if (!person) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Nothing found!')

                message.channel.send(embed).then(m => m.delete({ timeout: 5000 })).catch(err => console.error(err));
                return;
            }

            let pics = await wikifeet.getImages(person);
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
        } catch (e) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Error!')

                message.channel.send(embed).then(m => m.delete({ timeout: 5000 })).catch(err => console.error(err));
        }

    }
}