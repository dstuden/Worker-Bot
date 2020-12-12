const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');
const { findOne } = require('../models/guild');
const Guild = require('../models/guild');

module.exports = async (client, message) => {

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
            prefix: process.env.PREFIX
        })

        newGuild.save()
            .then(result => console.log(result))
            .catch(err => console.error(err));

            message.delete();
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('This server was not in my database! You can now use commands!');

            return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
    } else {
    }
    const prefix = settings.prefix;

    if (message.member.bot) return;
    if (!message.guild) return;

    if (message.content.startsWith(prefix + "ping")) {
        if (message.content.endsWith("ping")) {
            message.delete();
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('🏓 Pong!');

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        }
    }

    else if (message.content.startsWith(prefix + "serverinfo")) {
        if (message.content.endsWith("serverinfo")) {
            message.delete();
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(message.guild.name)
                .setThumbnail(message.guild.iconURL())
                .setDescription('Here is some information I found for this server.')
                .addField('Server ID', message.guild.id)
                .addField('Server owner', `${(message.guild.owner.user.username)} *(${message.guild.ownerID})*`)
                .addField("Total members | Humans | Bots", `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | ${message.guild.members.cache.filter(member => member.user.bot).size}`)
                .addField('Text channels | Voice channels', `${message.guild.channels.cache.filter(channel => channel.type === 'text').size} | ${message.guild.channels.cache.filter(channel => channel.type === 'voice').size}`)
                .addField('Roles', message.guild.roles.cache.size)
                .addField('Created at', message.guild.createdAt);

            return message.channel.send(embed).then(m => m.delete({ timeout: 20000 })).catch(err => console.error(err));

        }
    }

    else if (message.content.startsWith(prefix + "gengay")) {
        if (message.content.endsWith("gengay")) {
            if (message.member.hasPermission('MANAGE_ROLES')) {
                message.delete();
                if (message.member.guild.roles.cache.find(role => role.name === "GAY")) {

                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('Role GAY already exists!')

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

                } else {
                    message.guild.roles.create({
                        data: {
                            name: 'GAY',
                            color: 'RANDOM',
                        },
                        reason: 'we needed a role for gay People',
                    });
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('Created role GAY')

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                }
            } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('You dont have the permissions to do that')

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
            }
        }
    }

    else if (message.content.startsWith(prefix + "genstraight")) {
        if (message.content.endsWith("genstraight")) {
            if (message.member.hasPermission('MANAGE_ROLES')) {
                message.delete();
                if (message.member.guild.roles.cache.find(role => role.name === "STRAIGHT")) {
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('Role STRAIGHT already exists!')

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

                } else {
                    message.guild.roles.create({
                        data: {
                            name: 'STRAIGHT',
                            color: 'RANDOM',
                        },
                        reason: 'we needed a role for straight People',
                    });
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('Created role STRAIGHT')

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                }

            } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('You dont have the permissions to do that')

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
            }
        }
    }

    else if (message.content.startsWith(prefix + "genmute")) {
        if (message.content.endsWith("genmute")) {
            if (message.member.hasPermission('MANAGE_ROLES')) {
                message.delete();
                if (message.member.guild.roles.cache.find(role => role.name === "MUTED")) {

                    const guildChannels = message.guild.channels.cache.array().filter(channel => channel.type === 'text');
                    guildChannels.forEach(channel => {
                        channel.updateOverwrite(message.member.guild.roles.cache.find(role => role.name === "MUTED"), {
                            SEND_MESSAGES: false
                          })
                            .then(channel => console.log(channel.permissionOverwrites.get(message.author.id)))
                            .catch(console.error);
                    })

                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('Generated channel settings for role MUTED!')

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

                } else {
                    message.guild.roles.create({
                        data: {
                            name: 'MUTED',
                            color: 'GRAY',
                        },
                        reason: 'we needed a role for annoying People',
                    });

                    
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('Created role MUTED')

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

                }
            } else {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('You dont have the permissions to do that')

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
            }
        }
    }

    else if (message.content.startsWith(prefix + "kick")) {
        message.delete();
        if (!message.member.hasPermission('KICK_MEMBERS')) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`You don't have the permissions to do that!`)

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        } else {
            const user = message.mentions.users.first();
            if (user) {
                const member = message.guild.members.resolve(user);
                if (member) {

                    member
                        .kick('I am a mod!')
                        .then(() => {
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`Successfully kicked ${user.tag}`)

                            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                        })
                        .catch(err => {
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`Failed to kick ${user.tag}`)

                            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

                            console.error(err);
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

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 }))
            }

        }
    }

    else if (message.content.startsWith(prefix + "ban")) {
        message.delete();
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`You don't have the permissions to do that!`)

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        } else {
            const user = message.mentions.users.first();

            if (user) {

                const member = message.guild.members.resolve(user);

                if (member) {

                    member
                        .ban({
                            reason: 'I am a mod!',
                        })
                        .then(() => {
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`Successfully banned ${user.tag}`)

                            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                        })
                        .catch(err => {
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`Failed to ban ${user.tag}`)

                            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                            console.error(err);
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

    else if (message.content.startsWith(prefix + "mute")) {
        message.delete();
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

                    member.roles.add(message.guild.roles.cache.find(r => r.name === "MUTED"))
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle(`${user.tag} is now muted!`)

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

    else if (message.content.startsWith(prefix + "unmute")) {
        message.delete();
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

                    member.roles.remove(message.guild.roles.cache.find(r => r.name === "MUTED"))
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle(`${user.tag} is no longer muted!`)

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

    else if (message.content.startsWith(prefix + "delete")) {
        message.delete();
        if (message.member.hasPermission('MANAGE_MESSAGES')) {

            message.delete();
            let deleteNum = message.content.split(' ');

            message.channel.bulkDelete(deleteNum[1]).catch(error => {

                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('Failed!');

                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

            });
        } else {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('You dont have the permissions to do that')

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        }
    }

    else if (message.content.startsWith(prefix + "prefix")) {
        message.delete();
        if (message.member.hasPermission("MANAGE_GUILD")) {
            const newPrefix = message.content.split(' ');

            if (newPrefix.includes(':')) {
                return;
            } else {

                if (typeof newPrefix[1] === 'undefined') {
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('Enter the new prefix!');

                    return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));

                } else {
                    await settings.updateOne({
                        prefix: newPrefix[1]
                    });

                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle('The new prefix for this server is ' + newPrefix[1]);

                    message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                }
            }

        } else {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('You dont have the permissions to do that!');

            message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
        }
    }

    else if (message.content.startsWith(prefix + "help")) {
        if (message.content.endsWith("help")) {
            message.delete();

            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle("Help")
                .setThumbnail('https://i.imgur.com/aYVhF8y.png')
                .setDescription('Here are the avalible commands!')
                .addFields(
                    { name: prefix + 'Ping', value: 'it pings you', inline: true },
                    { name: prefix + 'gengay / genstraight', value: 'generates the roles for spam/ignore', inline: true },
                    { name: prefix + 'genmute', value: 'generates the channel permissions for MUTED role', inline: true },
                    { name: prefix + 'kick / ban', value: 'kicks / bans the specified user', inline: true },
                    { name: prefix + 'mute / unmute', value: 'kicks / bans the specified user', inline: true },
                    { name: prefix + 'delete', value: 'delete the specific number of messages', inline: true },
                    { name: prefix + 'help', value: 'helps you', inline: true },
                    { name: prefix + 'serverinfo', value: 'shows information about the current server', inline: true },
                    { name: prefix + 'prefix', value: 'sets the prefix for the current server', inline: true },

                )

            return message.channel.send(embed);
        }
    }

}