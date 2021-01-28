const { MessageEmbed } = require('discord.js');
const fs = require('fs');

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

                    fs.readFile('./persistentRoles/persistentAbyss.txt', function (err, data) {
                        if (err) throw error;
                        data = data + '';
                        let dataArray = data.split('\n');
                        const searchKeyword = user.id;
                        let lastIndex = -1;

                        for (let index = 0; index < dataArray.length; index++) {
                            if (dataArray[index].includes(searchKeyword)) {
                                lastIndex = index;
                                break;
                            }
                        }

                        dataArray.splice(lastIndex, 1);

                        const updatedData = dataArray.join('\n');
                        fs.writeFile('./persistentRoles/persistentAbyss.txt', updatedData, (err) => {
                            if (err) throw err;
                            console.log('Successfully removed from the abyss data');
                        });

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
        }
    }
}