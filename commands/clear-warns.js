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
    if(!db.has(guild).value() || !db.get(guild).has(member.user.id).value()){
        return msg.channel.send("This member has no warns !")
    }

    db.get(guild).unset(member.user.id).write()
    msg.channel.send(`Every ${member.user.username}' warns are deleted !`)
}

exports.info = {
    name : "clear-warns",
    alias: ["purge-warns"],
    perm : ""
}


exports.help = {
    desc : "Clear member's warns",
    usage : config.prefix + "clear-warns <@mention>",
    ex : config.prefix + "clear-warns @JockeRider199",
    cat : "mod"
}