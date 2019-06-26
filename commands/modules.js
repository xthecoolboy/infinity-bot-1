const Discord = require("discord.js"),
lowdb = require('lowdb'),
FileSync = require("lowdb/adapters/FileSync"),
config = require("../config.json");

exports.execute = (client, msg, args, config) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send("This command require ADMINISTRATOR permission !")

    const adapter = new FileSync(`./database/modules.json`);
    const db = lowdb(adapter)

    if(!db.has(msg.guild.id).value()){
        db.set(msg.guild.id, {
            detectAndBanSelfbots : false,
            enableBlacklist : false
        }).write()
    }
    

    var modules = ["detectAndBanSelfbots", "enableBlacklist", "enableCaptcha"]
    var chosenModule = args[1]
    var status = args[2]
    var truefalse = ["true", "false"]  

    if(!chosenModule) return msg.channel.send("You have to choose the module to enable/disable")
    if(!status) return msg.channel.send("You have to choose if you enable or disable the module !")
    if(!truefalse.includes(status)) return msg.channel.send(`Please type \`${config.prefix}help modules\` to get helped`)
    if(!modules.includes(chosenModule)) return msg.channel.send("This module doesn't exist. You can get the list of modules by typing " + config.prefix + "help modules")

    switch(status){
        case "true":
                db.get(msg.guild.id).update(chosenModule, () => true).write()
                var embed = new Discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setAuthor("Modules", client.user.avatarURL())
                    .addField("Chosen Module", chosenModule)
                    .addField("New Status", "Enabled")
                    .setFooter(config.embed.footer)
                msg.channel.send(embed)
            break;
        case "false":
                db.get(msg.guild.id).update(chosenModule, () => false).write()
                var embed = new Discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setAuthor("Modules", client.user.avatarURL())
                    .addField("Chosen Module", chosenModule)
                    .addField("New Status", "Disabled")
                    .setFooter(config.embed.footer)
                msg.channel.send(embed)
            break;
    }
}

exports.info = {
    name : "modules",
    alias : ["module"],
    perm : ""
}

exports.help = {
    desc : "Enable/disable modules\nList of modules : \n- detectAndBanSelfbots;\n- enableBlacklist;\n- enableCaptcha",
    usage : config.prefix + "modules <module name> <true | false>",
    ex : config.prefix + "modules detectAndBanSelfbots false",
    cat : "admin"
}