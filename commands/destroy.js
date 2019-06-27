const Discord = require("discord.js"),
logger = require("../functions/console-logger")

exports.execute = (client, msg, args, config) => {
    
    msg.delete().catch(() => {});

    msg.delete()
    logger.warn("Client destroyed !")
    client.destroy()
}

exports.info = {
    name : "destroy",
    alias : [],
    perm : "owner"
}

exports.help = {
    desc : "Shutdown the client",
    usage : "/",
    ex : "/",
    cat : "owner"
}