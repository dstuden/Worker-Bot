const sendImage = require('../../utils/sendImage.js');
const {fetch} = require("./fetch");
const {MessageEmbed} = require("discord.js");

module.exports = {
    name: 'foob',
    category: 'fun',
    description: 'Send a random image',
    usage: `$rand <image> | $foob | $chika | $rushia`,
    aliases: ['rand', 'chika', 'rushia'],
    run: async (client, message) => {
        const args = message.content.split(' ').map(arg => arg.toLowerCase().trim());
        const who = knownChars[args[0].slice(1)] || knownChars[args[1]] || args[1]

        const url = `post/index.json?limit=1&tags=${message?.channel?.nsfw ? '' : 'rating:s+'}+order:random+${who}`;
        let response = null;
        try {
            response = JSON.parse(await fetch(url))[0];
        } catch (_) { }

        const embed = new MessageEmbed().setColor('#d9639a')

        if (!(response && response?.file_url)) {
            embed.setImage(foob404)
        } else {
            /(webp|jpg|jpeg|png)/.test(response.file_url) ? embed.setImage(response.file_url) : embed.attachFiles([{
                name: who + '.png',
                attachment: response.file_url
            }])
        }
        message.channel.send(embed).catch(err => console.error(err));
    },
}

const foob404 = 'https://media.discordapp.net/attachments/909421773987127309/921834614669058088/foob_404.png'

const knownChars ={
    "foob": "shirakami_fubuki",
    "chika": "fujiwara_chika",
    "rushia": "uruha_rushia"
}
