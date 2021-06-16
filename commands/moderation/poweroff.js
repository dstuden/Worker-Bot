const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'poweroff',
    category: 'moderation',
    description: 'leaves the server',
    usage: `poweroff`,
    run: async (client, message) => {
        message.delete();
        if (message.member.hasPermission('MANAGE_GUILD' || 'KICK_MEMBERS')) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('Leaving the server. Sadge...')
                .setFooter('PogWorks Studios ©️ 2021')

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
            message.guild.leave();
        } else {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('You dont have the permissions to do that!')
                .setFooter('PogWorks Studios ©️ 2021')

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        }
    }
}
