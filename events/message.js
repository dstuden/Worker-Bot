const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');
const Guild = require('../models/guild');
const { findOne } = require('../models/guild');

module.exports = async (client, message) => {

    if (message.author.bot) return;

    if (!message.guild) {
        return message.channel.send("No DM's pls!");
    }

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
            defaultrole: ''
        })

        newGuild.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle('This server was not in my database! You can now use commands!');

        return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
    } else {
    }
    const prefix = settings.prefix;

    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command)
        command.run(client, message, args);
};
