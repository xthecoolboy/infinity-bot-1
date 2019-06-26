const Discord = require("discord.js"),
config = require("../config.json"),
low = require('lowdb'),
FileSync = require("lowdb/adapters/FileSync"),
moment = require("moment");
moment.locale("en")

exports.execute = (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("MANAGE_MESSAGES")) return msg.channel.send("This command require MANAGE_MESSAGES permission !")

    var adapter = new FileSync("./database/warns.json")
    var db = low(adapter)
    let guild = msg.guild.id
    let member = msg.mentions.members.first()

    if(!member) return msg.channel.send("This command require a member mention !")
    if(!db.get(guild).value() || !db.get(guild).get(member.user.id).value()){

        var embed = new Discord.MessageEmbed()
            .setColor(config.embed.color)
            .setAuthor("Member's warns", client.user.avatarURL())
            .addField("Member", member.user.tag)
            .addField("5 last member's warn", "No warns found")
            .setFooter(config.embed.footer)
        msg.channel.send(embed)
    }else{

        var warnsList = ""
        var getWarns = db.get(guild).get(member.user.id).value().map(e => {
            warnsList += `→ Date : ${e.date}\nReason : ${e.reason}\nMod : ${e.Mod}\n\n`
        })
        

        var embed = new Discord.MessageEmbed()
            .setColor(config.embed.color)
            .setAuthor("Member's warns", client.user.avatarURL())
            .addField("Member", member.user.tag)
            .addField("5 last member's warn", warnsList)
            .setFooter(config.embed.footer)
        msg.channel.send(embed)
    }
}

exports.info = {
    name : "warnings",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "See member's warns",
    usage : config.prefix + "warnings <@mention>",
    ex : config.prefix + "warnings @JockeRider199",
    cat : "mod"
}