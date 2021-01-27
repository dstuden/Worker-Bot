const mongoose = require('mongoose');
const Guild = require('../models/guild');
const fs = require('fs');

module.exports = async (client, member) => {
    
    const settings = await Guild.findOne({
        guildID: member.guild.id
    }).catch(err => {
        console.log(err)
    });

    const user = member;
    fs.readFile('./persistentRoles/persistentMute.txt', function (err1, dupe) {
        if (err1) throw err1;
        if (dupe.indexOf(user.id) >= 0) {
            member.roles.add(member.guild.roles.cache.find(role => role.name == 'MUTED')).catch(err => console.error(err));
        }
    });

    if (settings == null) {
        const newGuild = new Guild({
            _id: mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            guildName: member.guild.name,
            prefix: process.env.PREFIX,
            defaultRole: ''
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

    if(settings.defaultrole === '') {
        return;
    } else {
        member.roles.add(member.guild.roles.cache.find(role => role.name == settings.defaultRole)).catch(err => console.error(err));
    }
    
};