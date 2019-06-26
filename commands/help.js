const Discord = require("discord.js");
const config = require("../config.json")

exports.execute = (client, msg, args, config) => {

    msg.delete().catch(() => {});

    if(!args[1]){ // Simple menu
        
        var infoCmds = []
        var adminCmds = []
        var modCmds = []
        var othersCmds = []

        client.commands.forEach(cmd => {

            switch(cmd.help.cat){
                case "info":
                    infoCmds.push("`" + cmd.info.name + `\``)
                    break;
                case "admin":
                    adminCmds.push("`" + cmd.info.name + `\``)
                    break;
                case "mod":
                    modCmds.push("`" + cmd.info.name + `\``)
                    break;
                case "invisible":
                    break;
                default:
                    othersCmds.push("`" + cmd.info.name + `\``);
                    break;
            }
        })

    
        var embed = new Discord.MessageEmbed()
            .setColor(config.embed.color)
            .setAuthor(`Help Menu (${client.commands.length} commands)`, client.user.avatarURL())
            .setDescription(`Want more informations about a command ? Type \`${config.prefix}help <commandName>\``)
            .addField(`Infos Commands (${infoCmds.length})`, infoCmds.join(", "))
            .addField(`Admin Commands (${adminCmds.length})`, adminCmds.join(", "))
            .addField(`Moderation Commands (${modCmds.length})`, modCmds.join(", "))
            if(othersCmds.length > 0){
                embed.addField(`Others Commands (${othersCmds.length})`, othersCmds.join(", "))
            }
            embed.setFooter(config.embed.footer)
        msg.channel.send(embed);

    }else{ // Question avancée

        var codeBlock = {start : "```\n", end : "\n```"}
        let cmdFind = client.commands.find(cmd => cmd.info.name == args[1] || cmd.info.alias.includes(args[1])) // Défini la cmd dont l'utilisateur parle

        if(cmdFind){
            if(cmdFind.info.name == "copy"){
                var embed = new Discord.MessageEmbed()
                    .setColor(config.embed.color)
                    .setAuthor("Help Copy Command", client.user.avatarURL())
                    .addField("To have your server copied correctly :", `**1.** Invite ${client.user.username} in your 2 servers ([link here](https://discordapp.com/api/oauth2/authorize?client_id=591530190094598144&permissions=8&scope=bot))\n**2.** Give him admin permissions and put his role at the top of the roles.\n**3.** Make \`${config.prefix}copy <id of the other server> in the server to copy\``)
                    .addField("__**IMPORTANT**__", `The command \`${config.prefix}copy <id from the other server>\` must be done in the server to copy`)
                    .addField("To know", `${client.user.username} will copy the server where the command will be done and the id you provide in the command will be that of the server that will be overwritten by cloning.`)
                    .setFooter(config.embed.footer)
                msg.channel.send(embed)
            }

            var embed = new Discord.MessageEmbed()
                .setColor(config.embed.color)
                .setTitle(`Help ${args[1]} command`)
                .setDescription(cmdFind.help.desc)
                if(cmdFind.info.alias == ""){ // Check si la commande a des alias
                    embed.addField("Alias", `${codeBlock.start}No alias${codeBlock.end}`)
                }else{
                    embed.addField("Alias", `${codeBlock.start}${cmdFind.info.alias}${codeBlock.end}`)
                }
                embed.addField("Usage", codeBlock.start + cmdFind.help.usage + codeBlock.end)
                .addField("Exemple", codeBlock.start + cmdFind.help.ex + codeBlock.end)
            return msg.channel.send(embed)
        }else{
            return msg.channel.send("This command doesn't exist !") // Catch si aucune cmd possède le nom donné
        }
    }
}

exports.info = {
    name : "help",
    alias : ["commands", "command", "cmds", "cmd"],
    perm : ""
}

exports.help = {
    desc : "Give bot's commands",
    usage : config.prefix + "help [command]",
    ex : config.prefix + "help || " + config.prefix + "help stats",
    cat : "info"
}