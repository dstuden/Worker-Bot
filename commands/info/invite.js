const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'invite',
    category: 'info',
    description: 'invite link',
    usage: 'invite',
    run: async (client, message) => {
        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle('Here is your invite link')
            .setDescription('https://discord.com/oauth2/authorize?client_id=755532648419557447&scope=bot&permissions=8')

        return message.channel.send(embed).catch(err => console.error(err));
    }
}