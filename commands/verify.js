const Discord = require("discord.js"),
config = require("../config.json"),
low = require("lowdb"),
FileSync = require("lowdb/adapters/FileSync");

exports.execute = (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("BAN_MEMBERS")) return msg.channel.send("This command require BAN_MEMBERS permission !")

    var adapter1 = new FileSync("./database/modules.json");
    var adapter2 = new FileSync("./database/blacklist.json");
    var modules = low(adapter1);
    var bl = low(adapter2);

    if(!modules.has(msg.guild.id).value() || modules.get(msg.guild.id).get("enableBlacklist").value() != true){
        return msg.channel.send(`You have to enable this module ! Please check this command : ${config.prefix}help modules`)
    }

    var banned = []
    blLength =  bl.value().length

    for(var i = 0; i < blLength; i++){
        var toBan = bl[i];
        msg.guild.members.ban(toBan).catch(() => {})
        .then(() => {
            banned.push(toBan);
        })
    }

    if(banned.length > 0){
        let embed = new Discord.MessageEmbed()
            .setColor(config.embed.color)
            .setAuthor("Blacklist Verification", client.user.avatarURL())
            .setDescription(`You server is now clean ! I banned ${banned.length} members !`)
            .setFooter(config.embed.footer)
        msg.channel.send(embed)
    }else{
        let embed = new Discord.MessageEmbed()
            .setColor(config.embed.color)
            .setAuthor("Blacklist Verification", client.user.avatarURL())
            .setDescription(`You server is clean !`)
            .setFooter(config.embed.footer)
        msg.channel.send(embed)
    }
}

exports.info = {
    name : "verify",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "Check for blacklisted members in your guild",
    usage : config.prefix + "verify",
    ex : "/",
    cat : "admin"
}