const Discord = require("discord.js"),
ms = require("ms")

exports.execute = (client, msg, args, config) => {
    
    msg.delete().catch(() => {});

    msg.channel.send(config.code.red + "Client is restarting !" + config.code.end).then(() => {
        client.destroy()
    }).then(() => {
        setTimeout(() => {
            client.login(config.token)
            msg.channel.send(config.code.green + "Client restared" + config.code.end)
        }, ms("2s"))
    })
}

exports.info = {
    name : "restart",
    alias : [],
    perm : "owner"
}

exports.help = {
    desc : "Restart the client",
    usage : "/",
    ex : "/",
    cat : "owner"
}