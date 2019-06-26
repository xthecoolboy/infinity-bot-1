const Discord = require("discord.js"),
config = require("../config.json"),
package = require("../package.json")

exports.execute = (client, msg, args, config) => {

    msg.delete().catch(() => {});

    var repo = package.repository.url
    var repoUrl = repo.substring(4)

    var embed = new Discord.MessageEmbed()
        .setColor(config.embed.color)
        .setAuthor("My links", client.user.avatarURL())
        .setDescription(`This Bot is Open-Source ! It's created for Discord Hack Week !\n\nThis is [his github repo](${repoUrl})\n`)
        .setFooter(config.embed.footer)
    msg.channel.send(embed)        
}

exports.info = {
    name : "links",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "Give bot's links",
    usage : config.prefix + "links",
    ex : "/",
    cat : "info"
}