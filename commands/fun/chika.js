const { MessageEmbed } = require('discord.js');
const { fetch } = require('../../utils/fetch');

module.exports = {
    name: 'chika',
    category: 'fun',
    description: 'Send a random image of Fujiwara Chika',
    usage: `chika`,
    run: async (client, message) => {

        const url = `post/index.json?limit=1&tags=${message?.channel?.nsfw ? '' : 'rating:s+'}+order:random+fujiwara_chika`;
        const response = JSON.parse(await fetch(url))[0];
        const embed = new MessageEmbed().setColor(process.env.COLOR)
        if (response?.file_url) {
            /(webp|jpg|jpeg|png)/.test(response.file_url) ? embed.setImage(response.file_url) : embed.attachFiles([{ name: 'chika.png', attachment: response.file_url }])
        } else {
            embed.setImage(chika404)
            embed.setTitle("Whoops! **404**")
        }

        message.channel.send({ embeds: [embed] }).catch(err => console.error(err));
    }
}

const chika404 = 'https://c.tenor.com/1IxBeCZ8uNgAAAAC/uzaki-chika.gif';