const { MessageEmbed } = require("discord.js");

// import avalible commands
const stop = require("./functions/stop.js");
const skip = require("./functions/skip.js");
const queueList = require("./functions/queueList.js");
const loop = require("./functions/loop.js");
const mute = require("./functions/mute.js");

const queue = new Map(),
  fileTypes = ["mp3", "mp4", "mkv", "flac", "webm", "wav", "ogg", "opus"];

const helpEmbed = new MessageEmbed()
  .setColor(process.env.COLOR)
  .setTitle("🤚 Chose a command: ")
  .addField(`\`${process.env.PREFIX}m p/play\``, "play a song")
  .addField(`\`${process.env.PREFIX}m dc/disconect\``, "disconect")
  .addField(`\`${process.env.PREFIX}m s/stop\``, "skip song")
  .addField(`\`${process.env.PREFIX}m queue\``, "returns queue")
  .addField(`\`${process.env.PREFIX}m help\``, "help")
  .addField(`\`${process.env.PREFIX}m mute\``, "mutes play notifications")
  .addField(
    `\`${process.env.PREFIX}m reset\``,
    "if the bot is only adding music to queue and not playing it, use this command"
  );

const wrongEmbed = new MessageEmbed()
  .setColor(process.env.COLOR)
  .setTitle(`💀 Wrong command! 💀`);

const emptyQueryEmbed = new MessageEmbed()
  .setColor(process.env.COLOR)
  .setTitle("❗ Enter a song ❗");

const notInVCEmbed = new MessageEmbed()
  .setColor(process.env.COLOR)
  .setTitle("❗ You are not in a voice channel ❗");

const invalidLinkEmbed = new MessageEmbed()
  .setColor(process.env.COLOR)
  .setTitle("❗ Invalid link ❗");

module.exports = {
  name: "m",
  category: "music",
  description: "play music from files",
  usage: `m`,
  run: async (client, message) => {
    const serverQueue = queue.get(message.guild.id);

    // for keeping track of what's playing
    let queueIndex = 0;

    let command = message.content.split(" ").slice(1);
    command = command[0];

    // help menu if no command is specified
    if (command === undefined) {
      return message.channel.send(helpEmbed).catch((err) => console.error(err));
    }

    let content = message.content.split(" ").slice(1);
    content = content.slice(1).join(" ");

    let file = content.split(".");
    file = file.pop();

    // shitty (i know) command handler
    switch (command) {
      case "p":
        execute(message, serverQueue);
        break;
      case "play":
        execute(message, serverQueue);
        break;
      case "dc":
        stop(message, queue, serverQueue, queueIndex);
        break;
      case "disconect":
        stop(message, queue, serverQueue, queueIndex);
        break;
      case "s":
        skip(message, serverQueue, queueIndex);
        break;
      case "skip":
        skip(message, serverQueue, queueIndex);
        break;
      case "queue":
        queueList(message, serverQueue, queueIndex);
        break;
      case "loop":
        loop(message, serverQueue);
        break;
      case "mute":
        mute(message, serverQueue);
        break;
      case "help":
        message.channel
          .send(helpEmbed)
          .then((m) => m.delete({ timeout: 10000 }))
          .catch((err) => console.error(err));
        break;
      default:
        message.channel
          .send(wrongEmbed)
          .then((m) => m.delete({ timeout: 10000 }))
          .catch((err) => console.error(err));
        break;
    }

    async function execute(message, serverQueue) {
      // handling potential errors if not connected...
      if (content === "") {
        return message.channel
          .send(emptyQueryEmbed)
          .then((m) => m.delete({ timeout: 10000 }))
          .catch((err) => console.error(err));
      }

      let vc = message.member.voice.channel;

      const queueConstructor = {
        txtChannel: message.channel,
        vChannel: vc,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
        looping: false,
        muted: false,
      };

      if (!vc) {
        return message.channel
          .send(notInVCEmbed)
          .then((m) => m.delete({ timeout: 10000 }))
          .catch((err) => console.error(err));
      } else {
        // checks what type of content is requested
        if (fileTypes.includes(file) === true) {
          playFile(queueConstructor, vc);
        } else {
          return message.channel
            .send(invalidLinkEmbed)
            .then((m) => m.delete({ timeout: 10000 }))
            .catch((err) => console.error(err));
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

      let file = serverQueue.songs[queueIndex].url.split("."); // in case there is a file in the queue
      file = file.pop();

      if (fileTypes.includes(file) === true) {
        const dispatcher = serverQueue.connection
          .play(song.url)
          .on("finish", () => {
            if (serverQueue.songs.length - queueIndex === 1) {
              if (serverQueue.looping === true) {
                queueIndex = -1;
              } else if (serverQueue.looping === false) {
                serverQueue.songs = [];
              }
              queueIndex++;
              play(guild, serverQueue.songs[queueIndex]);
            } else {
              queueIndex++;
              play(guild, serverQueue.songs[queueIndex]);
            }
          });
      } else {
        const dispatcher = serverQueue.connection
          .play(ytdl(song.url))
          .on("finish", () => {
            if (serverQueue.songs.length - queueIndex === 1) {
              if (serverQueue.looping === true) {
                queueIndex = -1;
              } else if (serverQueue.looping === false) {
                serverQueue.songs = [];
              }
              queueIndex++;
              play(guild, serverQueue.songs[queueIndex]);
            } else {
              queueIndex++;
              play(guild, serverQueue.songs[queueIndex]);
            }
          });
      }
      if (!serverQueue.muted) {
        const playEmbed = new MessageEmbed()
          .setColor(process.env.COLOR)
          .setTitle(`▶️ Now playing ${serverQueue.songs[queueIndex].title}`)
          .setDescription(`${serverQueue.songs[queueIndex].url}`);

        serverQueue.txtChannel
          .send(playEmbed)
          .then((m) => m.delete({ timeout: 20000 }))
          .catch((err) => console.error(err));
      }
    }

    async function playFile(queueConstructor, vc) {
      let song = {
        title: `a song requested by ${message.author.tag}`,
        url: content,
        name: "???",
        artist: "???",
      };

      if (!serverQueue) {
        queue.set(message.guild.id, queueConstructor);

        queueConstructor.songs.push(song);

        let connection = await vc.join();
        queueConstructor.connection = connection;
        play(message.guild, queueConstructor.songs[queueIndex]);
      } else {
        serverQueue.songs.push(song);
        serverQueue.looping = false;

        const queueEmbed = new MessageEmbed()
          .setColor(process.env.COLOR)
          .setTitle(`✳️ Added to queue ${song.title}`)
          .setDescription(`${song.url}`);

        return message.channel
          .send(queueEmbed)
          .then((m) => m.delete({ timeout: 10000 }))
          .catch((err) => console.error(err));
      }
    }
  },
};
