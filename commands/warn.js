const Discord = require("discord.js"),
config = require("../config.json"),
low = require('lowdb'),
FileSync = require("lowdb/adapters/FileSync"),
moment = require("moment");
moment.locale("en")

exports.execute = (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("MANAGE_MESSAGES")) return msg.channel.send("This command require MANAGE_MESSAGES permission !")

    let guild = msg.guild.id
    let member = msg.mentions.members.first()
    let reason = args.slice(2).join(" ")
    let fReason = ""

    if(!member) return msg.channel.send("This command require a guild member mention !")
    if(!reason){
        fReason = "No Reason Given"
    }else{
        fReason = reason
    }

    var adapter = new FileSync("./database/warns.json")
    var db = low(adapter)

    if(!db.has(guild).value()) db.set(guild, {}).write();
    if(!db.get(guild).has(member.user.id).value()) db.get(guild).set(member.user.id, []).write()

    db.get(guild).get(member.user.id).unshift({
        reason : fReason,
        date : moment().format("L") + " | " + moment().format("LT"),
        Mod : msg.author.tag
    }).write()

    var embed = new Discord.MessageEmbed()
        .setColor(config.embed.color)
        .setAuthor('New Warn', client.user.avatarURL())
        .addField("Member Warned", member.user.tag)
        .addField("Reason", fReason)
        .addField("By Mod", msg.author.tag)
        .setFooter(config.embed.footer)
    msg.channel.send(embed)
}

exports.info = {
    name : "warn",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "Warn member",
    usage : config.prefix + "warn <@mention> [reason]",
    ex : config.prefix + "warn @Jockerider199 Bad Words",
    cat : "mod"
}