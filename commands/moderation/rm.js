const { MessageEmbed } = require('discord.js');
const talkedRecently = new Set();


module.exports = {
    name: 'rm',
    category: 'moderation',
    description: 'deletes messages',
    usage: `rm`,
    run: async (client, message) => {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            if (talkedRecently.has(message.author.id)) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Please wait before using this command again!')
                    .setFooter('PogWorks Studios ©️ 2021')

                message.channel.send(embed).then(m => m.delete({ timeout: 5000 })).catch(err => console.error(err));
            } else {

                let deleteNum = message.content.split(' ');

                message.channel.bulkDelete(deleteNum[1]).catch(error => {

                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('Failed!')
                        .setFooter('PogWorks Studios ©️ 2021')

                    message.channel.send(embed).then(m => m.delete({ timeout: 5000 })).catch(err => console.error(err));

                });

                talkedRecently.add(message.member.id);
                setTimeout(() => {

                    talkedRecently.delete(message.member.id);
                }, 5000);
            }
        } else {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('You dont have the permissions to do that')
                .setFooter('PogWorks Studios ©️ 2021')

            message.channel.send(embed).then(m => m.delete({ timeout: 5000 })).catch(err => console.error(err));
        }
    }
}