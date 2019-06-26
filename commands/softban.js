const Discord = require("discord.js"),
config = require("../config.json"),
ms = require("ms");

exports.execute = (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.channel.send("This command require BAN_MEMBERS permission !")

    var time = args[1];
    var member = msg.mentions.members.first();
    var reason = args.slice(3).join(" ");
    var fReason = ""

    if(!time) return msg.channel.send("This command require time field !")
    if(!member) return msg.channel.send("This command require member mention !")

    if(!reason){
        fReason = "No reason given !"
    }else{
        fReason = reason
    }

    member.ban({reason : fReason}).then(() => {
        var embed = new Discord.MessageEmbed()
            .setColor(config.embed.color)
            .setAuthor("Member Banned", client.user.avatarURL())
            .addField("Member", member.user.tag)
            .addField("Reason", fReason)
            .addField("Time", time)
            .addField("Mod", msg.author.username)
        msg.channel.send(embed)

        setTimeout(() => {
            msg.guild.members.unban(member.user.id)
        }, ms(time))
    })
}

exports.info = {
    name : "softban",
    alias : "tempban",
    perm : ""
}
exports.help = {
    desc : "Ban a member temporarily",
    usage : config.prefix + "softban <time> <@member> [reason]",
    exemple : config.prefix + "sofban 1m @JockeRider199 bad words",
    cat : "mod"
}