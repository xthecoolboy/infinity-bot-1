const Discord = require("discord.js"),
config = require("../config.json"),
ms = require("ms");

exports.execute = (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send("This command require ADMINISTRATOR permission !")

    msg.guild.channels.forEach(c => {
        c.overwritePermissions({
            permissionOverwrites : [
                {
                    id : msg.guild.id,
                    deny : ["SEND_MESSAGES"]
                }
            ]
        })
    })

    msg.guild.roles.filter(r => r.permissions.has("MANAGE_CHANNELS")).forEach(r => {
        msg.guild.channels.forEach(c => {
            c.overwritePermissions({
                permissionOverwrites : [
                    {
                        id : r.id,
                        allow : ["SEND_MESSAGES"]
                    }
                ]
            })
        })
    })

    msg.channel.send({embed : {description : "This guild is now locked !"}})
}

exports.info = {
    name : "lock",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "Lock the guild",
    usage : config.prefix + "lock",
    ex : "/",
    cat : "admin"
}