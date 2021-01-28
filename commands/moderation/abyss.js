const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'abyss',
    category: 'moderation',
    description: 'Sends a user into the abyss.',
    usage: `abyss`,
    run: async (client, message) => {
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`You don't have the permissions to do that!`)

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        } else {
            const user = message.mentions.users.first();

            if (message.member.guild.roles.cache.find(role => role.name === "ABYSS")) {
                if (user) {

                    const member = message.guild.members.resolve(user);

                    if (member) {

                        fs.readFile('./persistentRoles/persistentAbyss.txt', function (err1, dupe) {
                            if (err1) throw err1;
                            if (dupe.indexOf(user.id) >= 0) {
                                const embed = new MessageEmbed()
                                    .setColor(process.env.COLOR)
                                    .setTitle(`${user.tag} is already in the abyss.`)

                                return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                            }
                            else {
                                fs.appendFile('./persistentRoles/persistentAbyss.txt', user.id + `,\n`, function (err2) {
                                    if (err2) throw err2;
                                    console.log('Updated the abyss file!');
                                });

                                member.roles.add(message.guild.roles.cache.find(r => r.name === "ABYSS")).catch(err => console.error(err));
                                const embed = new MessageEmbed()
                                    .setColor(process.env.COLOR)
                                    .setTitle(`${user.tag} is now in the abyss!`)

                                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                            }
                        });

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

            } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle(`Please generate the ABYSS role first!`)

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
            }
        }
    }
}