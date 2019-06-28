const Discord = require("discord.js"),
config = require("../config"),
low = require("lowdb"),
FileSync = require("lowdb/adapters/FileSync"),
ms = require("ms")

exports.execute = (client, msg, args) => {

    msg.delete().catch(() => {});

    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send("This command requrie ADMINISTRATOR permission.")

    var setting = args[1];
    var acceptedSettings = ["captcha", "tickets"];
    var menu = ""
    acceptedSettings.forEach(s => {
        menu += "- " + s + "\n"
    });

    if(!setting){
        var embed = new Discord.MessageEmbed()
            .setColor(config.embed.color)
            .setAuthor("Settings Menu", client.user.avatarURL())
            .setDescription(`Here are the different settings :\n\n ${menu}`)
        return msg.channel.send(embed)
    }

    if(acceptedSettings.includes(setting)){
        switch(setting){
            case "captcha":
                captcha()
                break;
            case "tickets":
                tickets()
                break;
            default:
                break;
        }
    }else{
        return msg.channel.send("This setting doesn't exist !")
    }


    function captcha(){
        var adapter = new FileSync("./database/captcha.json");
        var db = low(adapter);

        msg.channel.send("Please, mention the captcha channel, where the new user join")
        var channelCollector = new Discord.MessageCollector(msg.channel, m => msg.author.id == m.author.id, {time : 20000})
        channelCollector.on("collect", message => {
            channelCollector.stop()
            if(!message.mentions.channels){
                return msg.channel.send("you have to mention a channel !")
            }
            if(!db.get("guilds").has(msg.guild.id).value()) db.get("guilds").set(msg.guild.id, {}).write()
            db.get("guilds").get(msg.guild.id).set("channel", message.mentions.channels.first().id)
            .write()

            msg.channel.send("Please mention the role that will be assigned to new members")
            var roleCollector = new Discord.MessageCollector(msg.channel, m => msg.author.id == m.author.id, {time : 20000})
            
            roleCollector.on("collect", async message => {
                roleCollector.stop()
                if(!message.mentions.roles){
                    return msg.channel.send("you have to mention a role !")
                }
                db.get("guilds").get(msg.guild.id).set("role", message.mentions.roles.first().id)
                .write()

                await msg.guild.channels.forEach(c => {
                    if(!c.deletable) return;
                    if(c.id == db.get("guilds").get(msg.guild.id).get("channel").value()) return;
                    c.overwritePermissions({
                        permissionOverwrites : [
                            {
                                id : db.get("guilds").get(msg.guild.id).get("role").value(),
                                deny : ["READ_MESSAGES"]
                            }
                        ]
                    })
                })

                var fEmbed = new Discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setAuthor("Captcha Settings", client.user.avatarURL())
                    .setDescription("Modification of the settings completed")
                return msg.channel.send(fEmbed);
            })
        })
        return;
    }

    function tickets(){
        var adapter = new FileSync("./database/tickets.json");
        var db = low(adapter);

        msg.channel.send("Please, type de name of the category, where tickets will be created")
        var channelCollector = new Discord.MessageCollector(msg.channel, m => msg.author.id == m.author.id, {time : 20000})
        channelCollector.on("collect", message => {
            channelCollector.stop()
            var channel = msg.guild.channels.find(c => c.type == "category" && c.name == message.content)
            if(!channel){
                msg.channel.send("This category doesn't exist !")
            }   
            db.set(msg.guild.id, {category : channel.id}).write()

            msg.channel.send("Please, type the message that users will see when they create a ticket")
            var msgCollector = new Discord.MessageCollector(msg.channel, m => msg.author.id == m.author.id, {time : ms("4min")})

            msgCollector.on("collect", message => {
                msgCollector.stop()
                db.get(msg.guild.id).update("msg", () => message.content).write()
                msg.channel.send({embed : {description : "Modification of the settings completed"}})
            })
        })
    }
}

exports.info = {
    name : "settings",
    alias : ["sets"],
    perm : ""
}

exports.help = {
    desc : "Change bot's settings.",
    usage : config.prefix + "settings <setting>",
    ex : config.prefix + "settings captcha",
    cat : "admin"
}