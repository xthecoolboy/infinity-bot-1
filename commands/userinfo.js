const Discord = require("discord.js");
const config = require("../config.json")
const moment = require("moment")
moment.locale("en")

exports.execute = (client, msg, args, config) => {
   
    msg.delete().catch(o_0 => {});

    // Def
    let member = msg.mentions.members.first();
    var roles = [];
    var perms = [];
    var code = "```\n"
    var block = "\n```"

    if(!member) return msg.channel.send("Aucun membre mentionné !")

    // Catch des roles
    member.roles.forEach(role => {
        roles.push("-> " + role.name + "\n");
    })
    roles.pop()

    // Catch des perms
    if(member.permissions.has("ADMINISTRATOR")){
        perms.push("ADMINISTRATOR              ✅\n")
    }else{
        perms.push("ADMINISTRATOR              ❌\n")
    }

    if(member.permissions.has("MANAGE_ROLES")){
        perms.push("MANAGE ROLES               ✅\n")
    }else{
        perms.push("MANAGE ROLES               ❌\n")
    }

    if(member.permissions.has("CREATE_INSTANT_INVITE")){
        perms.push("CREATE INVITE              ✅\n")
    }else{
        perms.push("CREATE INVITE              ❌\n")
    }

    if(member.permissions.has("KICK_MEMBERS")){
        perms.push("KICK MEMBERS               ✅\n")
    }else{
        perms.push("KICK MEMBERS               ❌\n")
    }

    if(member.permissions.has("BAN_MEMBERS")){
        perms.push("BAN MEMBERS                ✅\n")
    }else{
        perms.push("BAN MEMBERS                ❌\n")
    }

    if(member.permissions.has("MANAGE_CHANNELS")){
        perms.push("MANAGE CHANNELS            ✅\n")
    }else{
        perms.push("MANAGE CHANNELS            ❌\n")
    }

    if(member.permissions.has("MANAGE_GUILD")){
        perms.push("MANAGE GUILD               ✅\n")
    }else{
        perms.push("MANAGE GUILD               ❌\n")
    }

    if(member.permissions.has("ADD_REACTIONS")){
        perms.push("ADD REACTIONS              ✅\n")
    }else{
        perms.push("ADD REACTIONS              ❌\n")
    }

    if(member.permissions.has("MANAGE_MESSAGES")){
        perms.push("MANAGE MESSAGES            ✅\n")
    }else{
        perms.push("MANAGE MESSAGES            ❌\n")
    }

    if(member.permissions.has("MENTION_EVERYONE")){
        perms.push("MENTION @EVERYONE          ✅\n")
    }else{
        perms.push("MENTION @EVERYONE          ❌\n")
    }

    if(member.permissions.has("MANAGE_NICKNAMES")){
        perms.push("MANAGE NICKNAMES           ✅\n")
    }else{
        perms.push("MANAGE NICKNAMES           ❌\n")
    }

    // Embed
    let embed = new Discord.MessageEmbed()
        .setColor(config.embed.color)
        .setThumbnail(member.user.avatarURL())
        .setAuthor("User Info", client.user.avatarURL)
        .addField("Username et ID", code + member.user.tag + "\n" + member.user.id + block, true)
        .addField("Mention", member, true)
        if(member.nickname){
            embed.addField("Nickname", code + member.nickname + block, true)
        }else{
            embed.addField("Nickname", code + "No Nickname" + block, true)
        }
        embed.addField("Account created at", code + moment.utc(member.user.createdAt).format("LL") + block, true)
        if(member.user.bot){
            embed.addField("Bot", code + "YES" + block, true)
        }else{
            embed.addField("Bot", code + "NO" + block, true)
        }
        if(roles.length == 0){
            embed.addField("Roles", code + "No roles" + block, true)
        }else{
            embed.addField("Roles", code + roles.join("") + block, true)
        }
        embed.addField("Joined the guild at", code + moment.utc(member.joinedAt).format("LL") + block, true)
        embed.addField("Permissions", code + perms.join("") + block)
        .setFooter(config.embed.footer)

    msg.channel.send(embed)
}

exports.info = {
    name : "userinfo",
    alias : ["ui"],
    perm : ""
}

exports.help = {
    desc : "Give mentionned user's infos",
    usage : config.prefix + "userinfo @mention",
    ex : config.prefix + "userinfo @JockeRider199",
    cat : "info"
}