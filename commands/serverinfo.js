const Discord = require("discord.js");
const config = require("../config.json");
const moment = require("moment");
moment.locale("en")

exports.execute = (client, msg, args, config) => {

    msg.delete().catch(() => {});

    var embed = new Discord.MessageEmbed()
        .setColor(config.embed.color)
        .setTitle(`Check informations for : ${msg.guild.name} !`)
        .addField("Server Name :", `\`Name : ${msg.guild.name}\``)
        .addField("Server owner :", `\`Name : ${msg.guild.owner.user.tag}\nID : ${msg.guild.ownerID}\``, true)
        .addField("Other infos :", `\`Members size : ${msg.guild.members.size}\nChannels & Categories size : ${msg.guild.channels.size}\nRoles size : ${msg.guild.roles.size}\``, true)
        .addField("Created At :", `\`Server created since : ${moment().format("L")}\``)
        .addField("Server Country :", `\`Country : ${msg.guild.region}\``)
        .setFooter(config.embed.footer)
    msg.channel.send(embed)
}

exports.info = {
    name : "serverinfo",
    alias : ["si"],
    perm : ""
}

exports.help = {
    desc : "Give server's info",
    usage : config.prefix + "serverinfo",
    ex : "/",
    cat : "info"
}