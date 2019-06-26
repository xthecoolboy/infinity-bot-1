const Discord = require("discord.js");
const backup = require("discord-backup");
const config = require("../config.json");

exports.execute = (client, msg, args, config) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("ADMINSITRATOR")) return msg.channel.send("This command require **ADMINSTRATOR** permission !")

    var originalGuild = msg.guild
    var newGuildId = args[1]

    if(!newGuildId) return msg.channel.send("Missing an option !\n" + `Please type \`${config.prefix}help copy\` to have help`)
    if(isNaN(newGuildId)) return msg.channel.send(`Options \`newGuild\` is not valid !`)
    if(!client.guilds.get(newGuildId))return msg.channel.send(`The bot isn't on this server !`)

    msg.channel.send(config.code.blue + "Creating a backup ..." + config.code.end);

    backup.create(msg.guild).then(backupId => {

        var newGuild = client.guilds.get(newGuildId);
        
        msg.channel.send(config.code.green + "Loading backup..." + config.code.end)

        backup.load(backupId, newGuild).then(() => {
            backup.delete(backupId)
            msg.channel.send(config.code.red + "Server copied !" + config.code.end)
        }).catch(() => msg.channel.send("An error occurenced... Please check that I have administrator permissions !"))
    }).catch(() => msg.channel.send("An error occurenced... Please check that I have administrator permissions !"))
}

exports.info = {
    name :"copy",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "Copy Servers",
    usage : `${config.prefix}copy <server id to paste>`,
    ex: `${config.prefix}copy 591537647994798101`,
    cat : "admin"
}