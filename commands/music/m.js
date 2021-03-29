const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const dytdl = require('ytdl-core-discord');
const { YTSearcher } = require('ytsearcher');
const ffmpeg = require("ffmpeg");

const searcher = new YTSearcher({
    key: process.env.YOUTUBEKEY,
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
                .addField(`\`${process.env.PREFIX}m p\``, 'play song')
                .addField(`\`${process.env.PREFIX}m dc\``, 'disconect')
                .addField(`\`${process.env.PREFIX}m s\``, 'skip song')

            return message.channel.send(embed).catch(err => console.error(err))
        }

        let content = message.content.split(' ').slice(1);
        content = content.slice(1).join(' ')

        switch (command) {
            case 'p':
                execute(message, serverQueue);
                break;
            case 'dc':
                stop(message, serverQueue);
                break;
            case 's':
                skip(message, serverQueue);
                break;

        }

        async function execute(message, serverQueue) {
            if (content === "") {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('❗ Enter a song ❗')

                return message.channel.send(embed).catch(err => console.error(err))
            }
            let vc = message.member.voice.channel;
            if (!vc) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('❗ You are not in a voice channel ❗')

                return message.channel.send(embed).catch(err => console.error(err))
            } else {
                if (content.startsWith("https://www.youtube.com/watch")) {
                    const songInfo = await dytdl.getInfo(content);
                    try {
                        let song = {
                            title: songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url
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
                                message.channel.send(embed).catch(err => console.error(err));
                            }
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`▶️ Playing ${song.title} `)
                                .setDescription(`${song.url}`)
                            message.channel.send(embed).catch(err => console.error(err));
                        }
                        else {
                            serverQueue.songs.push(song);
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`✳️ Added to queue ${song.title}`)
                                .setDescription(`${song.url}`)
                            return message.channel.send(embed).catch(err => console.error(err));
                        }
                    } catch (err) {
                        console.log(err);
                        const embed = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle('❌  Failed  ❌')
                        message.channel.send(embed).catch(err => console.error(err));
                    }
                }

                else {
                    try {
                        let result = await searcher.search(content, { type: "video" });
                        const songInfo = await dytdl.getInfo(result.first.url);

                        let song = {
                            title: songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url
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
                                message.channel.send(embed).catch(err => console.error(err));
                            }
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`▶️ Playing ${song.title} `)
                                .setDescription(`${song.url}`)
                            message.channel.send(embed).catch(err => console.error(err));
                        }
                        else {
                            serverQueue.songs.push(song);
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`✳️ Added to queue ${song.title}`)
                                .setDescription(`${song.url}`)
                            return message.channel.send(embed).catch(err => console.error(err));
                        }
                    } catch (err) {
                        console.log(err);
                        const embed = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle('❌  Failed  ❌')
                        message.channel.send(embed).catch(err => console.error(err));
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
            serverQueue.txtChannel.send(embed).catch(err => console.error(err));
        }
        function stop(message, serverQueue) {
            if (!message.member.voice.channel)
                return message.channel.send("You need to join the voice chat first!");
            try {
                serverQueue.songs = [];
                serverQueue.connection.dispatcher.end();
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle(`✅  Left VC`)
                serverQueue.txtChannel.send(embed).catch(err => console.error(err));
            }
            catch (err) {
            }
        }
        function skip(message, serverQueue) {
            try {
                if (!message.member.voice.channel)
                    return message.channel.send("You need to join the voice chat first");
                if (!serverQueue)
                    return message.channel.send("There is nothing to skip!");
                serverQueue.connection.dispatcher.end();
            }
            catch (err) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('❌  Failed  ❌')
                message.channel.send(embed).catch(err => console.error(err));
            }
        }

    }
}
