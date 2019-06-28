const Discord = require("discord.js"),
config = require("../config.json");

exports.execute = async (client, msg, args) => {

    if(!msg.member.permissions.has("ADMINISTRATOR")) return msg.channel.send("This command require ADMINISTRATOR permission")

    var msgs = 0

    for (let index = 0; index <= 3; index++) {
        if (msg.channel.type == 'text') {
           await msg.channel.messages.fetch()
            .then(async (messages) => {
                await msg.channel.bulkDelete(messages);
                messagesDeleted = messages.array().length;
                msgs = msgs + messagesDeleted;
            }).catch(err => {
                console.log('error.');
                console.log(err);
            });
        }
    }

    msg.channel.send(`I deleted ${msgs} messages`).then(s => s.delete({timeout : 3000}))
}

exports.info = {
    name : "masspurge",
    alias : ["massclear"],
    perm : ""
}

exports.help = {
    desc : "Clear every messages in the channel",
    usage : config.prefix + "masspurge",
    ex : "/",
    cat : "admin"
}