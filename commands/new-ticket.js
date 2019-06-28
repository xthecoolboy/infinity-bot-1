const Discord = require("discord.js"),
config = require("../config.json"),
low = require("lowdb"),
FileSync = require("lowdb/adapters/FileSync");

exports.execute = async (client, msg, args) => {

    msg.delete().catch(() => {});

    var adapter = new FileSync("./database/tickets.json");
    var tickets = low(adapter);
    var adapter2 = new FileSync("./database/modules.json");
    var modules = low(adapter2);
    var reason = args.slice(1).join(" ")

    if(!modules.has(msg.guild.id) || modules.get(msg.guild.id).get("enableTickets").value() != true){
        return msg.channel.send("The enableTickets module is not enabled on this server !");
    };
    if(!tickets.has(msg.guild.id)) return msg.channel.send("This guild doesn't setup this system.")

    var category = msg.guild.channels.find(c => c.type == "category" && c.id == tickets.get(msg.guild.id).get("category").value())
    var EmbedMsg = tickets.get(msg.guild.id).get("msg").value()

    if(!category) return msg.channel.send("I can't find the tickets' category...")


    var embed = new Discord.MessageEmbed()
        .setColor(config.embed.color)
        .setAuthor("New Ticket", client.user.avatarURL())
        .setDescription(EmbedMsg)
        .addField("Asked by", msg.author.tag)
        .setFooter(config.embed.footer, msg.author.avatarURL())

    if(!reason){
        msg.guild.channels.create(msg.author.username, {
            type : "text",
            parent : category.id,
            permissionOverwrites : [
                {
                    id : msg.author.id,
                    allow : ["VIEW_CHANNEL"]
                },
                {
                    id : msg.guild.id,
                    deny : ["VIEW_CHANNEL"]
                }
            ],
            topic : "ticket-module"
        }).then(channel => {
            if(msg.guild.channels.find(c => c.name == channel.name && c.id != channel.id)){
                msg.channel.send("You have already created a ticket !")
                return channel.delete()
            }
            channel.send(embed)
            msg.channel.send({embed : {description : `Your ticket is created ! ${channel}`}})
        })   
    }else{
        msg.guild.channels.create(msg.author.username, {
            type : "text",
            parent : category.id,
            permissionOverwrites : [
                {
                    id : msg.author.id,
                    allow : ["VIEW_CHANNEL"]
                },
                {
                    id : msg.guild.id,
                    deny : ["VIEW_CHANNEL"]
                }
            ],
            topic : "ticket-module"
        }).then(channel => {
            if(msg.guild.channels.find(c => c.name == channel.name && c.id != channel.id)){
                msg.channel.send("You have already created a ticket !")
                return channel.delete()
            }
            embed.addField("Reason", reason)
            channel.send(embed)
            msg.channel.send({embed : {description : `Your ticket is created ! ${channel}`}})
        })
    }
}

exports.info = {
    name : "new-ticket",
    alias : ["open-ticket", "new-t"],
    perm : ""
}

exports.help = {
    desc : "Open a ticket",
    usage : config.prefix + "new-ticket [reason]",
    ex : config.prefix + "new-ticket Help !!!",
    cat : "ticket"
}