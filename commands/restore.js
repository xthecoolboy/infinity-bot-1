const Discord = require("discord.js"),
config = require("../config.json"),
low = require("lowdb"),
FileSync = require("lowdb/adapters/FileSync"),
validator = require("../functions/reaction-validator"),
backup = require("discord-backup"),
ms = require("ms");

exports.execute = (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send("This command require ADMINISTRATOR permission !")

    let backupId = args[1];
    let code = args[2];
    let adapter = new FileSync("./database/backups.json");
    let db = low(adapter);

    if(!backupId) return msg.channel.send(`This command require a backup ID ! Please type ${config.prefix}help restore`);
    if(!code) return msg.channel.send(`This command require a code ! Please type ${config.prefix}help restore`);
    if(!db.has(msg.guild.id).value() || !db.get(msg.guild.id).has(backupId).value()){
        return msg.channel.send("This backup doesn't exist !");
    };
    if(db.get(msg.guild.id).get(backupId).value().restoreCode != code) return msg.channel.send("This code is not valid !")

    validator.create(msg, {
        reactionOk : "✅",
        reactionNo : "⛔",
        deleteOnChoose : true,
        time : ms("15s"),
        embed : {
            color : config.embed.color,
            title : "Restore Backup",
            description : "Restoring the backup will delete your entire server. Check the reaction you want below",
            footer : config.embed.footer
        }
    }).then(result => {
        if(result == "ok"){
            backup.load(backupId, msg.guild).then(() => {
                let embed = new Discord.MessageEmbed()
                .setColor(config.embed.color)
                .setAuthor("Backup Loaded", client.user.avatarURL())
                .setDescription("Backup Loaded with success ! You can still load this backup in the future, it has not been deleted.")
            
                setTimeout(() => {
                    msg.guild.channels.filter(c => c.type == "text").first()
                    .send(embed)
                }, ms("5s"))
            }).catch(err => msg.channel.send("An error has been occured !"));
        };
        if(result == "no"){
            msg.channel.send("The restoration has been abandoned");
            return;
        };
    });
}

exports.info = {
    name : "restore",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "Restore your guild's backup. The code is given when you do the backup",
    usage : config.prefix + "restore <backupName> <your_code>",
    ex : config.prefix + "restore jocke",
    cat : "admin"
}