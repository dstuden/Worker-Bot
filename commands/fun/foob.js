const { MessageEmbed } = require('discord.js');
const { fetch } = require('../../utils/fetch');

module.exports = {
    name: 'foob',
    category: 'fun',
    description: 'Send a random image of Fubuki Shirakami',
    usage: `foob`,
    run: async (client, message) => {

        const url = `post/index.json?limit=1&tags=${message?.channel?.nsfw ? '' : 'rating:s+'}+order:random+shirakami_fubuki`;
        const response = JSON.parse(await fetch(url))[0];
        const embed = new MessageEmbed().setColor('#d9639a')
        if (response?.file_url) {
            /(webp|jpg|jpeg|png)/.test(response.file_url)? embed.setImage(response.file_url) : embed.attachFiles([{ name: 'foob.png', attachment: response.file_url }])
        } else {
            embed.setImage(foob404)
            embed.setTitle("Whoops!")
        }

        message.channel.send(embed).catch(err => console.error(err));
    }
}

const foob404 = 'https://media.discordapp.net/attachments/909421773987127309/921834614669058088/foob_404.png'