const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const ytsr = require('@distube/ytsr');
var { getTracks, getPreview } = require("spotify-url-info");
var ytpl = require('ytpl');

// import avalible commands
const stop = require('./functions/stop.js');
const lyrics = require('./functions/lyrics.js');
const skip = require('./functions/skip.js');
const queueList = require('./functions/queueList.js');
const loop = require('./functions/loop.js');

const queue = new Map(), fileTypes = ['mp3', 'mp4', 'mkv'];

// for keeping track what's playing
var queueIndex = 0;

module.exports = {
    name: 'm',
    category: 'music',
    description: 'play music',
    usage: `m`,
    run: async (client, message) => {

        const serverQueue = queue.get(message.guild.id);

        let command = message.content.split(' ').slice(1);
        command = command[0];

        // help menu if no command is specified
        if (command === undefined) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle('🤚 Chose a command: ')
                .addField(`\`${process.env.PREFIX}m p/play\``, 'play a song')
                .addField(`\`${process.env.PREFIX}m dc/disconect\``, 'disconect')
                .addField(`\`${process.env.PREFIX}m s/stop\``, 'skip song')
                .addField(`\`${process.env.PREFIX}m lyrics\``, 'disconect')
                .addField(`\`${process.env.PREFIX}m queue\``, 'disconect')
                .setFooter('PogWorks Studios ©️ 2021')

            return message.channel.send(embed).catch(err => console.error(err));
        }

        let content = message.content.split(' ').slice(1);
        content = content.slice(1).join(' ');

        let file = content.split('.');
        file = file.pop();

        // shitty (i know) command handler
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
                loop(message, serverQueue);
                break;
        }

        async function execute(message, serverQueue) {

            // handling potential errors if not connected...
            if (content === "") {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('❗ Enter a song ❗')
                    .setFooter('PogWorks Studios ©️ 2021')

                return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
            }
            let vc = message.member.voice.channel;
            if (!vc) {
                const embed = new MessageEmbed()
                    .setColor(process.env.COLOR)
                    .setTitle('❗ You are not in a voice channel ❗')
                    .setFooter('PogWorks Studios ©️ 2021')

                return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
            } else {

                // checks what type of content is requested
                if (content.startsWith("https://www.youtube.com/watch")) {
                    const songInfo = await ytdl.getInfo(content);
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
                                volume: 5,
                                playing: true,
                                looping: false
                            };
                            queue.set(message.guild.id, queueConstructor);

                            queueConstructor.songs.push(song);


                            let connection = await vc.join();
                            queueConstructor.connection = connection;
                            play(message.guild, queueConstructor.songs[0]);

                        }
                        else {
                            serverQueue.songs.push(song);
                            serverQueue.looping = false;
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`✳️ Added to queue ${song.title}`)
                                .setDescription(`${song.url}`)
                                .setFooter('PogWorks Studios ©️ 2021')
                            return message.channel.send(embed).then(m => m.delete({ timeout: 20000 })).catch(err => console.error(err));
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }

                }
                /*  this needs to be completed ASAP 😠
                else if (content.startsWith("https://www.youtube.com/playlist")) {

                    const playlist = await ytpl(content);
                    const media = playlist.items;
                    var i;

                    for(i of media) {

                        console.log(i.shortUrl);
                        const songInfo = await ytdl.getInfo(i.shortUrl);

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
                                volume: 5,
                                playing: true,
                                looping: false
                            };
                            queue.set(message.guild.id, queueConstructor);

                            queueConstructor.songs.push(song);

                            let connection = await vc.join();
                            queueConstructor.connection = connection;
                            play(message.guild, queueConstructor.songs[queueIndex]);
                        }
                        else {
                            serverQueue.songs.push(song);
                            serverQueue.looping = false;
                            console.log('added to queue!');
                        }
                    }
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR)
                        .setTitle(`✳️ Added ${media.length} songs to queue`)
                        .setFooter('PogWorks Studios ©️ 2021')
                    return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                }
                */
                else if (content.startsWith("https://open.spotify.com/track/")) {
                    const result = await getPreview(content);
                    var media = [];
                    const search = result.title + " " + result.artist;
                    try {
                        let item = await ytsr(search, { limit: 1 }).then(x => {
                            let song = x.items[0];
                            media = song.url
                        })
                    }
                    catch (err) {
                        console.log(err);
                    }
                    const songInfo = await ytdl.getInfo(media);

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
                            volume: 5,
                            playing: true,
                            looping: false
                        };
                        queue.set(message.guild.id, queueConstructor);

                        queueConstructor.songs.push(song);


                        let connection = await vc.join();
                        queueConstructor.connection = connection;
                        play(message.guild, queueConstructor.songs[queueIndex]);

                    }
                    else {
                        serverQueue.songs.push(song);
                        serverQueue.looping = false;
                        const embed = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle(`✳️ Added to queue ${song.title}`)
                            .setDescription(`${song.url}`)
                            .setFooter('PogWorks Studios ©️ 2021')
                        return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                    }

                }
                else if (fileTypes.includes(file) === true) {

                    let song = {
                        title: "untitled",
                        url: content,
                        name: "never gonna give you up",
                        artist: ""
                    };

                    if (!serverQueue) {
                        const queueConstructor = {
                            txtChannel: message.channel,
                            vChannel: vc,
                            connection: null,
                            songs: [],
                            volume: 5,
                            playing: true,
                            looping: false
                        };
                        queue.set(message.guild.id, queueConstructor);

                        queueConstructor.songs.push(song);

                        let connection = await vc.join();
                        queueConstructor.connection = connection;
                        play(message.guild, queueConstructor.songs[queueIndex]);

                    }
                    else {
                        serverQueue.songs.push(song);
                        serverQueue.looping = false;
                        const embed = new MessageEmbed()
                            .setColor(process.env.COLOR)
                            .setTitle(`✳️ Added to queue ${song.title}`)
                            .setDescription(`${song.url}`)
                            .setFooter('PogWorks Studios ©️ 2021')
                        return message.channel.send(embed).then(m => m.delete({ timeout: 10000 })).catch(err => console.error(err));
                    }

                }
                else {

                    var media = [];
                    try {
                        let result = await ytsr(content, { limit: 1 }).then(x => {
                            let song = x.items[0];
                            media = song.url
                        })

                        const songInfo = await ytdl.getInfo(media);

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
                                volume: 5,
                                playing: true,
                                looping: false
                            };
                            queue.set(message.guild.id, queueConstructor);

                            queueConstructor.songs.push(song);


                            let connection = await vc.join();
                            queueConstructor.connection = connection;
                            play(message.guild, queueConstructor.songs[0]);

                        }
                        else {
                            serverQueue.songs.push(song);
                            serverQueue.looping = false;
                            const embed = new MessageEmbed()
                                .setColor(process.env.COLOR)
                                .setTitle(`✳️ Added to queue ${song.title}`)
                                .setDescription(`${song.url}`)
                                .setFooter('PogWorks Studios ©️ 2021')
                            return message.channel.send(embed).then(m => m.delete({ timeout: 20000 })).catch(err => console.error(err));
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }
        }

        // this function is only here because i'm to lazy to import/export all the shit
        function play(guild, song) {

            const serverQueue = queue.get(guild.id);
            if (!song) {
                serverQueue.vChannel.leave();
                queue.delete(guild.id);
                queueIndex = 0;
                return;
            }

            let file = serverQueue.songs[queueIndex].url.split('.'); // in case there is a file in the queue
            file = file.pop();

            if (fileTypes.includes(file) === true) {
                const dispatcher = serverQueue.connection
                    .play(song.url)
                    .on('finish', () => {
                        if (serverQueue.songs.length - queueIndex === 1) {

                            if (serverQueue.looping === true) {
                                queueIndex = -1;
                            }
                            else if (serverQueue.looping === false) {
                                serverQueue.songs = [];
                            }

                            queueIndex++;
                            play(guild, serverQueue.songs[queueIndex]);

                        }
                        else {
                            queueIndex++;
                            play(guild, serverQueue.songs[queueIndex]);
                        }
                    })
            }
            else {
                const dispatcher = serverQueue.connection
                    .play(ytdl(song.url))
                    .on('finish', () => {
                        if (serverQueue.songs.length - queueIndex === 1) {

                            if (serverQueue.looping === true) {
                                queueIndex = -1;
                            }
                            else if (serverQueue.looping === false) {
                                serverQueue.songs = [];
                            }

                            queueIndex++;
                            play(guild, serverQueue.songs[queueIndex]);

                        }
                        else {
                            queueIndex++;
                            play(guild, serverQueue.songs[queueIndex]);
                        }
                    })
            }

            const embed = new MessageEmbed()
                .setColor(process.env.COLOR)
                .setTitle(`▶️ Now playing ${serverQueue.songs[queueIndex].title}`)
                .setDescription(`${serverQueue.songs[queueIndex].url}`)
                .setFooter('PogWorks Studios ©️ 2021')

            serverQueue.txtChannel.send(embed).then(m => m.delete({ timeout: 20000 })).catch(err => console.error(err));

        }
    }
}