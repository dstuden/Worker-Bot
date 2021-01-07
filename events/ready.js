module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}`)
    client.user.setPresence({
        activity: {
<<<<<<< HEAD
            name: 'PogOS!',
=======
            name: 'PogOS',
>>>>>>> master
            type: 'PLAYING'
        }
    });
}
