const Discord = require("discord.js"),
config = require("../config.json"),
moment = require("moment"),
ms = require("ms");

exports.execute = (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("KICK_MEMBERS")) return msg.channel.send("This command require KICK_MEMBERS permission !");

    var member = msg.mentions.members.first();
    var reason = args.slice(2).join(" ");
    var fReason = "";

    if(!member) return msg.channel.send("Tis command require a member mention !")
    if(!reason){
        fReason = "No reason given"
    }else{
        fReason = reason
    }

    try{
        member.kick(fReason).then(() => {
            var embed = new Discord.MessageEmbed()
                .setColor(config.embed.color)
                .setAuthor("Kick", client.user.avatarURL())
                .addField("Member Kicked", `\`${member.user.tag}\``)
                .addField("Reason", `\`${fReason}\``)
                .addField("By mod", `\`${msg.author.username}\``)
            msg.channel.send(embed)
        })
    }catch(err){
        msg.channel.send({embed : {description : "I can't kick this user !"}})
    }
}

exports.info = {
    name : "kick",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "Kick mentionned member",
    usage : config.prefix + "kick <@user> [reason]",
    ex : config.prefix + "kick @JockeRider199 Bad Words",
    cat : "mod"
}