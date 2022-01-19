const { MessageEmbed } = require("discord.js");
const moment = require('moment');
const mongoose = require('mongoose');
const GuildUser = require('../../models/guildUser');


module.exports = {
    name: "usrinfo",
    category: "info",
    description: "returns info about you",
    usage: `usrinfo`,
    run: async (client, message) => {
        if (!message.mentions.users.first())
            return User(message.guild.member(message.author), message);
        else
            if (message.mentions.users.first().id === message.author.id) {
                const baka = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle("Baka!")
                    .setDescription("Your aren't supposed to tag yourself!!🙃");

                return (User(message.guild.member(message.mentions.users.first().id), message), message.channel.send(baka).catch((err) => console.error(err)));
            }
            else
                return User(message.guild.member(message.mentions.users.first().id), message);

    },
};

async function User(user, message) {
    const roles = add_roles(user);

    let activities = []; // if the selected user is a bot, it'll show stats for the actual bot owner
    for (const activity of user.presence.activities.values()) {
        switch (activity.type) {
            case 'PLAYING':
                activities.push(`🎮 Playing **${activity.name}**`);
                break;
            case 'LISTENING':
                if (user.user.bot)
                    activities.push(`Listening to **${activity.name}**`);
                else
                    activities.push(`🎶 Listening to **${activity.details}** by **${activity.state}**`);
                break;
            case 'WATCHING':
                activities.push(`📺 Watching **${activity.name}**`);
                break;
            case 'STREAMING':
                activities.push(`🔴 Streaming **${activity.name}**`);
                break;
            case 'CUSTOM_STATUS':
                customStatus = activity.state;
                break;
        }
    }
    if (activities.length === 0) activities = ['not doing anything'];

    const isBot = user.user.bot ? true : false;
    const nickName = user.displayName ? user.displayName : user.user.username;
    const userInfo = await fetch_user_info(user);

    const embed = new MessageEmbed()
        .setColor(process.env.COLOR)
        .setTitle(user.user.tag)
        .setThumbnail(user.user.avatarURL())
        .setDescription(activities)
        .addField("Roles", `${roles}`)
        .addField(":hash: ID", "```" + user.user.id + "```", true)
        .addField("Is a bot?", "```" + isBot + "```", true)
        .addField("Nickname", "```" + nickName + "```")
        .addField("📅 Discord user since", "```" + moment(user.user.createdAt).format('MMMM Do YYYY, h:mm:ss a') + "```", true)
        .addField("Server member since", "```" + moment(user.joinedAt).format('MMMM Do YYYY, h:mm:ss a') + "```", true)
    if (!isBot) {
        embed
            .addField("**User stats**", "*as of 25/12/2021 from all visible servers*")
            .addField("Number of recorded messages", "```" + userInfo.messages + "```", true)
            .addField("Time spent in voice channels", "```" + Math.ceil(userInfo.voiceTime / 60) + " min```", true)
    }
    return message.channel.send(embed).catch((err) => console.error(err));
}

async function fetch_user_info(user) {
    const userInfo = await GuildUser.findOne({
        userID: user.user.id,
    }).catch(err => {
        console.error(err)
    });
    return userInfo;
}

function add_roles(user) {
    let roleNames = "";
    let numRoles = -1;
    user.roles.cache.forEach((e) => {
        if (e.name !== "@everyone" && numRoles < 4) roleNames += `${e}, `;
        numRoles++;
    });
    let tmp = roleNames.split(", ");
    tmp.pop();

    if (numRoles >= 6) tmp[4] += ` and ${numRoles - 5} more`;
    else if (numRoles == 0) {
        tmp = ["/"];
    }
    roleNames = tmp.join(", ");
    return roleNames;
}