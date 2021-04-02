const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const dytdl = require('ytdl-core-discord');
const { YTSearcher } = require('ytsearcher');
const stop = require('./stop.js')
const lyrics = require('./lyrics.js')
const skip = require('./skip.js')
const queueList = require('./queueList.js')

let youtubeApiKey = process.env.YOUTUBEKEY.split(',');
const randomIndex = Math.floor((Math.random() * 7));

const searcher = new YTSearcher({
    key: youtubeApiKey[randomIndex],
    revealed: true
});

const queue = new Map();

module.exports = {
    name: 'm',
    category: 'music',
    description: 'play music',
    usage: `m`,
    run: async (client, message) => {

        const serverQueue = queue.get(message.guild.id);

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
                skip(message, serverQueue);
                break;
            case 'stop':
                skip(message, serverQueue);
                break;
            case 'lyrics':
                lyrics(message, serverQueue);
                break;
            case 'queue':
                queueList(message, serverQueue);
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
                                playing: true
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
                                playing: true
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
                return;
            }
            const dispatcher = serverQueue.connection
                .play(ytdl(song.url))
                .on('finish', () => {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                })
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`▶️ Now playing ${serverQueue.songs[0].title}`)
                .setDescription(`${serverQueue.songs[0].url}`)
                .setFooter('PogWorks Studios ©️ 2021')

            serverQueue.txtChannel.send(embed).then(m => m.delete({ timeout: 20000 })).catch(err => console.error(err));
        }
    }
}
