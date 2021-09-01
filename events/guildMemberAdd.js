const mongoose = require('mongoose');
const { MessageEmbed, Message } = require('discord.js');
const Guild = require('../models/guild');

module.exports = async (client, member) => {

    const server = await Guild.findOne({
        guildID: member.guild.id
    }).catch(err => {
        console.error(err);
    });
    member.roles
        .add(server.defaultRole)
        .catch(err => {
            console.error(err);
        })
}