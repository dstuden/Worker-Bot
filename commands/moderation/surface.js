const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'surface',
    category: 'moderation',
    description: 'Returns a user from the abyss.',
    usage: `surface`,
    run: async (client, message) => {
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`You don't have the permissions to do that!`)

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        } else {
            const user = message.mentions.users.first();

            if (user) {

                const member = message.guild.members.resolve(user);

                if (member) {

                    member.roles.remove(message.guild.roles.cache.find(r => r.name === "ABYSS")).catch(err => console.error(err))
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle(`${user.tag} is no longer in the abyss!`)

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

                } else {
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle(`Unknown user!`)

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                }
            } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle(`No users were mentioned!`)

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

            }
        }
    }
}