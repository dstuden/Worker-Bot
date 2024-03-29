const { MessageEmbed, Permissions } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');

module.exports = {
    name: 'prefix',
    category: 'moderation',
    description: 'changes the prefix for the current server',
    usage: `prefix`,
    run: async (client, message) => {

        if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {

            const newPrefix = message.content.split(' ');

            const settings = await Guild.findOne({
                guildID: message.guild.id
            }).catch(err => {
                console.log(err)
            });

            if (settings == null) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: process.env.PREFIX,
                    defaultRole: ''
                })

                newGuild.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));

                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('This server was not in my database! You can now use commands!')

                message.channel.send({ embeds: [embed] }).then(msg => {
                    message.delete()
                    setTimeout(() => msg.delete(), 10000)
                }).catch(err => console.error(err));
            } else {
            }
            const prefix = settings.prefix;


            if (typeof newPrefix[1] === 'undefined') {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Enter the new prefix!')

                return message.channel.send({ embeds: [embed] }).catch(err => console.error(err));
            } else {
                await settings.updateOne({
                    prefix: newPrefix[1]
                });

                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('The new prefix for this server is ' + newPrefix[1])

                message.channel.send({ embeds: [embed] }).then(msg => {
                    message.delete()
                    setTimeout(() => msg.delete(), 10000)
                }).catch(err => console.error(err));
            }


        } else {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('You dont have the permissions to do that!')

            message.channel.send({ embeds: [embed] }).then(msg => {
                message.delete()
                setTimeout(() => msg.delete(), 10000)
            }).catch(err => console.error(err));
        }
    }
}
