const Discord = require("discord.js"),
config = require("../config"),
ms = require("ms"),
low = require("lowdb"),
FileSync = require("lowdb/adapters/FileSync");

exports.execute = async (client, msg, args) => {

    var adapterModules = new FileSync("./database/modules.json");
    var modules = low(adapterModules);

    var adapterCaptcha = new FileSync("./database/captcha.json");
    var captcha = low(adapterCaptcha);

    msg.delete().catch(() => {});

    if(!modules.has(msg.guild.id).value() || modules.get(msg.guild.id).get("enableCaptcha").value() != true) return;

    var channel = msg.guild.channels.get(captcha.get("guilds").get(msg.guild.id).get("channel").value())
    var role = msg.guild.roles.get(captcha.get("guilds").get(msg.guild.id).get("role").value())

    if(!channel || !role) return;

    if(!msg.member.roles.has(role.id)) return;
    if(msg.channel.id != channel.id) return;

    if(!args[1]){
        let code = makeid(8)
        captcha.get("members").set(msg.author.id, {code : code}).write()

        let embed = new Discord.MessageEmbed()
            .setColor(config.embed.color)
            .setDescription(`Send the following message below to be verified\n\n${config.code.yellow}${config.prefix}verif ${code} ${config.code.end}`)
        msg.channel.send(embed)
        
    }else{
        if(!captcha.get("members").has(msg.author.id).value()) return msg.channel.send(`No saved code, \`${config.prefix}verif\` to get a new code.`)
        if(args[1] == captcha.get("members").get(msg.author.id).get("code").value()){
            msg.author.send("Welcome to the server " + msg.guild.name)
            msg.guild.member(msg.author).roles.remove(role.id)
            msg.channel.messages.filter(m => m.author.id == msg.author.id || m.author.id == client.user.id).forEach(m => m.delete())

            captcha.get("members").unset(msg.author.id).write()
        }else{
            return msg.channel.send(`Bad code, \`${config.prefix}verif\` to get a new code`)
        }
    }
}

exports.info = {
    name : "verif",
    alias : [],
    perm : ""
}

exports.help = {
    desc : "Generate a captcha code\nThe first time the command is made without the code to obtain it and the second time it is done with the code to pass the verification",
    usage : config.prefix + "verif [code]",
    ex : config.prefix + "verif 3w92x1i3",
    cat : "invisible"
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}