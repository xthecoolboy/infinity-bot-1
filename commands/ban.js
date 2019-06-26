const Discord = require("discord.js"),
config = require("../config.json"),
ms = require('ms');

exports.execute = (client, msg, args, config) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.channel.send("This command require BAN_MEMBERS permission")

    var bUser = msg.mentions.members.first() 
    var reason = args.slice(2).join(" ") 
    var fReason

    if(!bUser) return msg.channel.send("You have to mention a member !")

    if(!reason){
        fReason = "No reason given"
    }else{
        fReason = reason
    }

    var bUserEmbed = new Discord.MessageEmbed()
        .setColor(config.embed.color)
        .setAuthor("BAN", client.user.avatarURL())
        .setDescription(`${bUser} a ban has been made to you.`)
        .addField("Infos", `Reason : **${fReason}**\nGuild Name : **${msg.guild.name}**\n\nThe ban will take place in **10 seconds.**`)
        .setFooter(config.embed.footer)
    bUser.send(bUserEmbed)

    var bEmbed = new Discord.MessageEmbed()
        .setColor(config.embed.color)
        .setAuthor("Ban Annoncement", client.user.avatarURL())
        .setDescription(`**${bUser} a ban has been made to you.**\nReason : ${fReason}.\n\nThe ban will take place in **10 seconds.**`)
        .setFooter(config.embed.footer)
    msg.channel.send(bEmbed)
    .then(sEmbed => {
        setTimeout(() => {
            sEmbed.edit(bEmbed.setDescription(`**${bUser} a ban has been made to you.**\nReason : ${fReason}.\n\nThe ban will take place in **9 seconds.**`))
            setTimeout(() => {
                sEmbed.edit(bEmbed.setDescription(`**${bUser} a ban has been made to you.**\nReason : ${fReason}.\n\nThe ban will take place in **8 seconds.**`))
                setTimeout(() => {
                    sEmbed.edit(bEmbed.setDescription(`**${bUser} a ban has been made to you.**\nReason : ${fReason}.\n\nThe ban will take place in **7 seconds.**`))
                    setTimeout(() => {
                        sEmbed.edit(bEmbed.setDescription(`**${bUser} a ban has been made to you.**\nReason : ${fReason}.\n\nThe ban will take place in **6 seconds.**`))
                        setTimeout(() => {
                            sEmbed.edit(bEmbed.setDescription(`**${bUser} a ban has been made to you.**\nReason : ${fReason}.\n\nThe ban will take place in **5 seconds.**`))
                            setTimeout(() => {
                                sEmbed.edit(bEmbed.setDescription(`**${bUser} a ban has been made to you.**\nReason : ${fReason}.\n\nThe ban will take place in **4 seconds.**`))
                                setTimeout(() => {
                                    sEmbed.edit(bEmbed.setDescription(`**${bUser} a ban has been made to you.**\nReason : ${fReason}.\n\nThe ban will take place in **3 seconds.**`))
                                    setTimeout(() => {
                                        sEmbed.edit(bEmbed.setDescription(`**${bUser} a ban has been made to you.**\nReason : ${fReason}.\n\nThe ban will take place in **2 seconds.**`))
                                        setTimeout(() => {
                                            sEmbed.edit(bEmbed.setDescription(`**${bUser} a ban has been made to you.**\nReason : ${fReason}.\n\nThe ban will take place in **1 seconds.**`))
                                            setTimeout(() => {
                                                sEmbed.delete()
                                                banUser()
                                            }, ms("1s"))
                                        }, ms("1s"))
                                    }, ms("1s"))
                                }, ms("1s"))
                            }, ms("1s"))
                        }, ms("1s"))
                    }, ms("1s"))
                }, ms("1s"))
            }, ms("1s"))
        }, ms("1s"))
    })

    function banUser(){
        if(!bUser.bannable) return msg.channel.send("I can't ban this user !")
        bUser.ban(fReason).catch(() => {
            msg.channel.send("I can't ban this user !")
        }).then(() => {
            var embed = new Discord.MessageEmbed()
                .setColor(config.embed.color)
                .setAuthor("Member Banned", client.user.avatarURL())
                .addField("Member", bUser.user.tag)
                .addField("Reason", fReason)
                .addField("Admin", msg.author.tag)
            msg.channel.send(embed)
        })
    }
}

exports.info = {
    name : "ban",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "Ban mentionned member",
    usage : config.prefix + "ban @mention [reason]",
    ex : config.prefix + "ban @JockeRider199 [bad words]",
    cat : "admin"
}