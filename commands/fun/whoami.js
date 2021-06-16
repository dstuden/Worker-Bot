const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'whoami',
    category: 'info',
    description: 'returns info about the server',
    usage: `whoami`,
    run: async (client, message) => {
        const roles  = message.guild.member(message.author).roles.cache;

        const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(message.author.tag)
                .setThumbnail(message.author.avatarURL())
                .setDescription('Here is some info about you.')
                .addField(':hash: ID', message.author.id)
                .addField('Roles', roles ? roles.array().length - 1 : 'None')
                .addField('📅 Created at', message.author.createdAt)
                .setFooter('PogWorks Studios ©️ 2021')


            return message.channel.send(embed).catch(err => console.error(err));
    }
}