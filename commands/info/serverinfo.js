const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    category: 'info',
    description: 'returns info about the server',
    usage: `serverinfo`,
    run: async (client, message) => {
        const owner = await message.guild.fetchOwner();
        const roles = await message.guild.roles.fetch();

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR)
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .setDescription('Here is some information I found for this server.')
            .addField('🆔 Server ID', message.guild.id)
            .addField('👑 Server owner', `${(owner.user.tag)} *(${message.guild.id})*`)
            .addField("Total members | Humans | Bots", `${message.guild.members.cache.size} | ${message.guild.members.cache.filter(member => !member.user.bot).size} | ${message.guild.members.cache.filter(member => member.user.bot).size}`)
            .addField('Text channels | Voice channels', `${message.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size} | ${message.guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size}`)
            .addField('Roles', `${roles.size}`)
            .addField('📅 Created at', `${message.guild.createdAt}`);

        return message.channel.send({ embeds: [embed] }).catch(err => console.error(err));
    }
}
