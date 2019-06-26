const Discord = require("discord.js"),
config = require("../config.json"),
low = require("lowdb"),
FileSync = require("lowdb/adapters/FileSync"),
backup = require("discord-backup"),
moment = require("moment");

moment.locale("en");

exports.execute = (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send("This command require ADMINISTRATOR permission !")

    var adapter = new FileSync("./database/backups.json");
    var db = low(adapter);
    var code = args[1];

    if(!code) return msg.channel.send(`This command require a code ! Please type ${config.prefix}help backup`)
    if(!db.has(msg.guild.id).value()){
        db.set(msg.guild.id, {}).write()
    }

    backup.create(msg.guild).then(backupID => {

        db.get(msg.guild.id).set(backupID, {
            "date" : moment().format("L"),
            "hour" : moment().format("LT"),
            "restoreCode" : code,
            "admin" : msg.author.tag
        }).write()

        if(Object.keys(db.get(msg.guild.id).value()).length > 5 ){ // Pas plus de 5 backups
            var obj = db.get(msg.guild.id).value()
            var array = Object.keys(obj)
            var lastBackup = array[0]
            backup.delete(lastBackup)
            db.get(msg.guild.id).unset(lastBackup).write()
        }

        var gEmbed = new Discord.MessageEmbed() // Embed envoyé dans le serv
            .setColor(config.embed.color)
            .setAuthor("Backup Command", client.user.avatarURL())
            .setDescription(`${config.emojis.aCheck} Backup Created !`)
            .setFooter(config.embed.footer)
        msg.channel.send(gEmbed)

        var mEmbed = new Discord.MessageEmbed() // Embed envoyé à l'admin
            .setColor(config.embed.color)
            .setAuthor("Backup Command", client.user.avatarURL())
            .setDescription(`${config.emojis.aCheck} Backup Created !`)
            .addField("Guild Name", `\`${msg.guild.name}\``)
            .addField("Restore code", `\`${code}\``)
            .addField("Backup Name", `\`${backupID}\``)
            .addField("How to restore my server ?", `You just have to do in the server you want to restore \`${config.prefix}restore ${backupID} ${code}\``)
            .setFooter(config.embed.footer)
        msg.author.send(mEmbed)
    })
}

exports.info = {
    name : "backup",
    alias : ["save"],
    perm : ""
}

exports.help = {
    desc : "Create guild save. :warning: The backup code must contain a single word (It can contain numbers)",
    usage : config.prefix + "backup <code>",
    ex : config.prefix + "backup Jocke",
    cat : "admin"
}


function filterIt(arr, searchKey) {
    return arr.filter(function(obj) {
      return Object.keys(obj).some(function(key) {
        return obj[key].includes(searchKey);
      })
    });
}