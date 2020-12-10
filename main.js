const discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const client = new discord.Client();
require("dotenv").config();
const fs = require('fs');
const { set } = require("mongoose");
const message = require("./events/message");
const guild = require("./models/guild");
client.mongoose = require('./utils/mongoose');


fs.readdir('./events', (err, files) => {
    if (err) return console.error;
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./events/${file}`);
        let evtName = file.split('.')[0];
        console.log(`Loaded event '${evtName}'`);
        client.on(evtName, evt.bind(null, client));
    });
});



client.mongoose.init();
client.login(process.env.BOT_TOKEN);
