const Discord = require("discord.js"),
config = require("../config.json");

exports.execute = (client, msg, args) => {

    msg.delete().catch(() => {});

    if(msg.channel.topic == "ticket-module"){
        msg.channel.delete().catch(err => {
            msg.channel.send("I can't delete this channel !")
        })
    }else{
        msg.channel.send("This channel is not a ticket !")
    }
}

exports.info = {
    name : "ticket-delete",
    alias : ["delete-ticket", "close-ticket", "ticket-close"],
    perm : ""
}

exports.help = {
    desc : "Delete a ticket",
    usage : config.prefix + "ticket-delete",
    ex : "/",
    cat : "ticket"
}