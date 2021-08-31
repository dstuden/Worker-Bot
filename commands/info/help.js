const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const Guild = require('../../models/guild');
const { stripIndents } = require('common-tags');

module.exports = {
    name: 'help',
    category: 'info',
    description: 'displays a full list of bot commands',
    usage: `help`,
    run: async (client, message) => {

        await Guild.findOne({
            guildID: message.guild.id
        }, (err, guild) => {
            if (err) console.error(err)
            if (!guild) {
                const newGuild = new Guild({
                    _id: mongoose.Types.ObjectId(),
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    prefix: process.env.PREFIX,
                    logChannelID: null
                });

                newGuild.save()
                    .then(result => console.log(result))
                    .catch(err => console.error(err));
            }
        });

        return getAll(client, message);
    }
}

async function getAll(client, message) {
    const guildDB = await Guild.findOne({
        guildID: message.guild.id
    });

    const embed = new MessageEmbed()
        .setColor(process.env.COLOR)
        .setTitle('Available commands')
        .setThumbnail(client.user.avatarURL())
        .setFooter('PogWorks Studios ©️ 2021')

    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- ${(guildDB.prefix) + cmd.name}\n \`${cmd.description}\``)
            .join('\n');
    }

    const info = client.categories
        .map(idk => stripIndents`**${idk[0].toLowerCase() + idk.slice(1)}** \n${commands(idk)}`)
        .reduce((string, category) => `${string}\n${category}`);

    return message.author.send(embed.setDescription(`\n\n${info}`)).catch(err =>
        message.channel.send(embed.setDescription(`\n\n${info}`)))

}