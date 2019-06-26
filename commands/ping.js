const Discord = require("discord.js");
const config = require("../config.json");

exports.execute = async (client, msg, args, config) => {

    msg.delete().catch(() => {});

    let newmsg = await msg.channel.send("Ping ?")

    let embed = new Discord.MessageEmbed()
    .setColor(config.embed.color)
    .addField('Ping API : ', Math.floor(client.ws.ping) + 'ms')
    .addField('Ping Bot : ', ` ${newmsg.createdTimestamp - msg.createdTimestamp}` + 'ms')
    .setFooter(config.embed.footer)
        
    newmsg.delete()
    msg.channel.send(embed)
}

exports.info = {
    name : "ping",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "Show bot's latency",
    usage : config.prefix + "ping",
    ex : "/",
    cat : "info"
}