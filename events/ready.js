module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}`)
    client.user.setPresence({
        activities: [{
            name: 'agitprop',
            type: 'LISTENING'
        }],
    });
}
