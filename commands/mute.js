const Discord = require("discord.js"),
config = require("../config.json"),
ms = require("ms");

exports.execute = async (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has('MANAGE_MESSAGES')) return msg.channel.send("This command require MANAGE_MESSAGES permission !")

    let mutedUser = msg.guild.member(msg.mentions.users.first());
    let mutedTime = args[2]
    let mutedReason = args.slice(3).join(" ")
    let mutedRole = msg.guild.roles.find(r => r.name == "INFINITY-MUTE");
    let fReson = ""

    if(!mutedUser) return msg.channel.send("Please mention a user fot perform this command !")
    if(!mutedTime) return msg.channel.send("Please, indicate the time to mute !")
    if(!mutedReason){
        fReson = "No reason given !"
    }else{
        fReson = mutedReason
    }
    if(mutedUser.permissions.has('MANAGE_MESSAGES')) return msg.channel.send("You cannot mute this user !")
    
    
    if(!mutedRole) {
        try {
            mutedRole = await msg.guild.roles.create({
                data : {
                    name: 'INFINITY-MUTE',
                    color: 'BLACK',
                    permissions: []
                }
            });
            msg.guild.channels.forEach(async (channel) => {
                await channel.overwritePermissions({
                    permissionOverwrites : [
                        {
                            id : mutedRole.id,
                            deny : ["SEND_MESSAGES", "ADD_REACTIONS"]
                        }
                    ]
                });
            })
        } catch(e) {
            msg.channel.send("An error occured, please check I have been ADMINISTRATOR permission")
        }
    }

    await mutedUser.roles.add(mutedRole.id);
    var mute_embed = new Discord.MessageEmbed()
        .setColor(config.embed.color)
        .setAuthor("Mute", client.user.avatarURL())
        .addField("User muted :", `\`Username :${mutedUser}\nID : ${mutedUser.user.id}\``, true)
        .addField("By mod :", `\`Username :${msg.author.username}\nID : ${msg.author.id}\``, true)
        .addField("Duration :", `\`${ms(ms(mutedTime))}\``)
        .addField("Reason :", `\`${mutedReason}\``)
        .setFooter(config.embed.footer)
    msg.channel.send(mute_embed)

    setTimeout(() => {
        mutedUser.roles.remove(mutedRole.id)
        msg.channel.send(`<@${mutedUser.id}> was unmuted ! :white_check_mark: `)
    }, ms(mutedTime))
    
}

exports.info = {
    name : "mute",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "Mute a member for a moment",
    usage : config.prefix + "mute @mention <time> [reason]",
    ex : config.prefix + "mute @JockeRider199 2m bad Words",
    cat : "mod"
}