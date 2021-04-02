const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const dytdl = require('ytdl-core-discord');
const { YTSearcher } = require('ytsearcher');

const stop = require('./functions/stop.js')
const lyrics = require('./functions/lyrics.js')
const skip = require('./functions/skip.js')
const queueList = require('./functions/queueList.js')
const loop = require('./functions/loop.js')

let youtubeApiKey = process.env.YOUTUBEKEY.split(',');
const randomIndex = Math.floor((Math.random() * 7));

const searcher = new YTSearcher({
    key: youtubeApiKey[randomIndex],
    revealed: true
});

const queue = new Map();
var queueIndex = 0;

module.exports = {
    name: 'm',
    category: 'music',
    description: 'play music',
    usage: `m`,
    run: async (client, message) => {

        const serverQueue = queue.get(message.guild.id);
        var loopQueue = [];

        let command = message.content.split(' ').slice(1);
        command = command[0];
        if (command === undefined) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('🙏  Chose a command: ')
                .addField(`\`${process.env.PREFIX}m p/play\``, 'play a song')
                .addField(`\`${process.env.PREFIX}m dc/disconect\``, 'disconect')
                .addField(`\`${process.env.PREFIX}m s/stop\``, 'skip song')
                .addField(`\`${process.env.PREFIX}m lyrics\``, 'disconect')
                .addField(`\`${process.env.PREFIX}m queue\``, 'disconect')
                .setFooter('PogWorks Studios ©️ 2021')

            return message.channel.send(embed).catch(err => console.error(err))
        }

        let content = message.content.split(' ').slice(1);
        content = content.slice(1).join(' ')

        switch (command) {
            case 'p':
                execute(message, serverQueue);
                break;
            case 'play':
                execute(message, serverQueue);
                break;
            case 'dc':
                stop(message, serverQueue);
                break;
            case 'disconect':
                stop(message, serverQueue);
                break;
            case 's':
                skip(message, serverQueue, queueIndex);
                break;
            case 'skip':
                skip(message, serverQueue, queueIndex);
                break;
            case 'lyrics':
                lyrics(message, serverQueue, queueIndex);
                break;
            case 'queue':
                queueList(message, serverQueue, queueIndex);
                break;
            case 'loop':
                loop(message, serverQueue, loopQueue);
                break;
        }

        async function execute(message, serverQueue) {
            if (content === "") {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('❗ Enter a song ❗')
                    .setFooter('PogWorks Studios ©️ 2021')

                return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err))
            }
            let vc = message.member.voice.channel;
            if (!vc) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('❗ You are not in a voice channel ❗')
                    .setFooter('PogWorks Studios ©️ 2021')

                return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err))
            } else {
                if (content.startsWith("https://www.youtube.com/watch")) {
                    const songInfo = await dytdl.getInfo(content);
                    try {
                        let song = {
                            title: songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url,
                            name: songInfo.videoDetails.media.song,
                            artist: songInfo.videoDetails.media.artist
                        };

                        if (!serverQueue) {
                            const queueConstructor = {
                                txtChannel: message.channel,
                                vChannel: vc,
                                connection: null,
                                songs: [],
                                volume: 10,
                                playing: true,
                                looping: false
                            };
                            queue.set(message.guild.id, queueConstructor);

                            queueConstructor.songs.push(song);

                            try {
                                let connection = await vc.join();
                                queueConstructor.connection = connection;
                                play(message.guild, queueConstructor.songs[queueIndex]);
                            } catch (err) {
                                console.log(err);
                                const embed = new MessageEmbed()
                                    .setColor(process.env.COLOR)
                                    .setTitle('❌  Failed to join  ❌')
                                    .setFooter('PogWorks Studios ©️ 2021')

                                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                            }
                        }
                        else {
                            serverQueue.songs.push(song);
                            serverQueue.looping=false;
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`✳️ Added to queue ${song.title}`)
                                .setDescription(`${song.url}`)
                                .setFooter('PogWorks Studios ©️ 2021')

                            return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                        }
                    } catch (err) {
                        console.log(err);
                        const embed = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle('❌  Failed  ❌')
                            .setFooter('PogWorks Studios ©️ 2021')

                        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                    }
                }

                else {
                    try {
                        let result = await searcher.search(content, { type: "video" });
                        const songInfo = await dytdl.getInfo(result.first.url);

                        let song = {
                            title: songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url,
                            name: songInfo.videoDetails.media.song,
                            artist: songInfo.videoDetails.media.artist
                        };

                        if (!serverQueue) {
                            const queueConstructor = {
                                txtChannel: message.channel,
                                vChannel: vc,
                                connection: null,
                                songs: [],
                                volume: 10,
                                playing: true,
                                looping: false

                            };
                            queue.set(message.guild.id, queueConstructor);

                            queueConstructor.songs.push(song);

                            try {
                                let connection = await vc.join();
                                queueConstructor.connection = connection;
                                play(message.guild, queueConstructor.songs[0]);
                            } catch (err) {
                                console.log(err);
                                const embed = new MessageEmbed()
                                    .setColor(process.env.COLOR)
                                    .setTitle('❌  Failed to join  ❌')
                                    .setFooter('PogWorks Studios ©️ 2021')

                                message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                            }
                        }
                        else {
                            serverQueue.songs.push(song);
                            serverQueue.looping=false;
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`✳️ Added to queue ${song.title}`)
                                .setDescription(`${song.url}`)
                                .setFooter('PogWorks Studios ©️ 2021')

                            return message.channel.send(embed).then(m => m.delete({ timeout: 20000 })).catch(err => console.error(err));
                        }
                    } catch (err) {
                        console.log(err);
                        const embed = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle('❌  Failed  ❌')
                            .setFooter('PogWorks Studios ©️ 2021')

                        message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                    }
                }
            }
        }
        function play(guild, song) {
            const serverQueue = queue.get(guild.id);
            if (!song) {
                serverQueue.vChannel.leave();
                queue.delete(guild.id);
                queueIndex = 0;
                return;
            }
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url))
                .on('finish', () => {
                    if (serverQueue.songs.length - queueIndex === 1) {
                        if (serverQueue.looping === true) {
                            queueIndex=0;
                            serverQueue.songs.forEach(loopSong => {
                                serverQueue.songs.push(loopSong);
                            })
                        }
                        else if (serverQueue.looping === false) {
                            serverQueue.songs=[];
                        }

                        queueIndex++;
                        play(guild, serverQueue.songs[queueIndex]);
                    }
                    else if (serverQueue.songs.length - queueIndex < 1) {
                        serverQueue.connection.dispatcher.end();
                    }
                    else {
                        queueIndex++;
                        play(guild, serverQueue.songs[queueIndex]);
                    }
                })
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`▶️ Now playing ${serverQueue.songs[queueIndex].title}`)
                .setDescription(`${serverQueue.songs[queueIndex].url}`)
                .setFooter('PogWorks Studios ©️ 2021')

            serverQueue.txtChannel.send(embed).then(m => m.delete({ timeout: 20000 })).catch(err => console.error(err));
        }
    }
}