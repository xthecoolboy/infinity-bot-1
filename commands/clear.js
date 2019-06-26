const Discord = require("discord.js"),
config = require("../config.json");

exports.execute = (client, msg, args, config) => {

    msg.delete().catch(() => {});

    var nbre = args[1]

    if(!nbre) return msg.channel.send("You have to tell me the number of messages to delete !")
    if(isNaN(nbre)) return msg.channel.send("This is not a number !")
    if(nbre > 100) return msg.channel.send("I can't delete more than 100 messages !")

    msg.channel.bulkDelete(nbre).then(deleted => {
        msg.channel.send(`I deleted ${deleted.size} messages`).then(s => s.delete({timeout : 3000}))
    }).catch(() => msg.channel.send("I can't delete them !"))
}

exports.info = {
    name : "clear",
    alias : ["clean", "purge"],
    perm : ""
}

exports.help = {
    desc : "Delete a lot of messages !",
    usage : config.prefix + "clear <number>",
    ex : config.prefix + "clear 15",
    cat : "mod"
}