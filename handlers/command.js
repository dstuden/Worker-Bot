const { readdirSync } = require('fs');

module.exports = (client) => {
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js'));

        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);

            if (pull.name) {
                client.commands.set(pull.name, pull);
                console.log(file + ' Loaded!');
            } else {
                console.log(file + ' Command failed to load, please check your work again!');
                continue;
            }

            if (pull.aliases && Array.isArray(pull.aliases))
                pull.aliases.forEach(alias => {
                    return client.aliases.set(alias, pull.name);
                });
        }
        console.log('----------');
    })
}