/////////////////////////////////REQUIREMENTS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const Discord = require("discord.js"),
ms = require("ms"),
client = new Discord.Client(),
config = require("./config.json"),
chalk = require("chalk"),
moment = require("moment"),
fs = require("fs"),
low = require("lowdb"),
FileSync = require("lowdb/adapters/FileSync");

moment.locale("en")
var cooldown = new Set()

/////////////////////////////////FUNCTIONS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var logger = require("./functions/console-logger");
var selfbots = require("./functions/selfbot");

/////////////////////////////////COMMANDS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
client.commands = [];

function loadCmds(){
    fs.readdir("./commands/", (err, files) => {
        if(err) console.log(err);
        files.forEach(f => {
            delete require.cache[require.resolve(`./commands/${f}`)];
            const cmd = require(`./commands/${f}`);
            const cmdName = f.split(".")[0];
            console.log(`Loaded : ${cmdName}`);
            client.commands.push(cmd);
        })
    });
};

/////////////////////////////////DATABASE\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function loadDbs(){
    client.databases = [];
    fs.readdir("./database/", (err, files) => {
        if(files.length = 0) return
        if(err) console.log(err);
        files.forEach(f => {
            delete require.cache[require.resolve(`./database/${f}`)];
            const dbName = f.split(".")[0];
            const db = require(`./database/${f}`)
            client.databases.push(db);
        })
    });
};

/////////////////////////////////LOGIN\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
client.login(config.token);

client.on("ready", () => {
    loadCmds()
    loadDbs()
    setTimeout(() => {
        console.clear()
        
        logger.sucess(`Connected to ${client.user.tag}\n${moment().format("LT")}`);
        game1()
    }, ms("1s"));
});

function game1(){
    client.user.setPresence({
        activity : {
            name : config.presence.activity,
            type : config.presence.type,
            url : "https://twitch.tv/bot developed by Jocke & Iko"
        },
        status : config.presence.status

    });
    setTimeout(game2, 4000)
}
function game2(){
    client.user.setPresence({
        activity : {
            name : config.presence.activity2.replace("{prefix}", config.prefix).replace("{cmd}", client.commands.length),
            type : config.presence.type,
            url : "https://twitch.tv/bot developed by Jocke & Iko"
        },
        status : config.presence.status

    });
    setTimeout(game3, 4000)
}
function game3(){
    client.user.setPresence({
        activity : {
            name : config.presence.activity3,
            type : config.presence.type,
            url : "https://twitch.tv/bot developed by Jocke & Iko"
        },
        status : config.presence.status

    });
    setTimeout(game1, 4000)
}

/////////////////////////////////COMMANDS HANDLER\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
client.on('message', msg => {

    if(!msg.guild) return;

    var adapter = new FileSync("./database/modules.json");
    var modulesDb = low(adapter)

    if(!modulesDb.has(msg.guild.id).value()) return;
    if(modulesDb.get(msg.guild.id).get("detectAndBanSelfbots").value() == false){
        return
    }else{
        var userLevel = selfbots.level(msg.author, msg.content, msg.nonce).then(async (level) => {
            if(level >= 3){
                msg.delete()
                msg.author.send("You are using a selfbot, so you were banned from " + msg.guild.name)
                await msg.member.ban({reason : "SelfBot", days : 7}).then(() => {
                    msg.channel.send(`${msg.author.tag} used a selfbot, so he was banned.`)
                }).catch(() => msg.channel.send(`I can't ban the selfbot ${msg.author}`))
            }
        })
    }
})

client.on("message", msg => {

    if(
        msg.author.bot ||
        msg.author.id == client.user.id ||
        msg.channel.type != "text",
        !msg.content.startsWith(config.prefix)
    ) return;

    var args = msg.content.substring(config.prefix.length).split(" ");
    var cmdName = args[0].toLowerCase();
    
    if(cmdName == "restart"){
        if(!config.OwnersID.includes(msg.author.id)) return;

        msg.delete().catch(() => {})

        msg.channel.send(config.code.red + "Client is restarting !" + config.code.end).then(() => {
            client.destroy()
        }).then(() => {
            setTimeout(() => {
                client.login(config.token)
                msg.channel.send(config.code.green + "Client restared" + config.code.end)
            }, ms("2s"))
        })
    }

    if(cmdName == "refresh"){
        if(!config.OwnersID.includes(msg.author.id)) return;
        msg.delete()
        loadCmds()
        loadDbs()
        msg.channel.send("Databases and commands are reloaded !")
    }

    if(cmdName == "destroy"){
        if(!config.OwnersID.includes(msg.author.id)) return;
        msg.delete()
        console.log(chalk.red.bold("Client destroyed !"))
        client.destroy()
    }

    client.commands.forEach(command => {
        if(cmdName == command.info.name || command.info.alias.includes(cmdName)){
            if(command.info.perm == 'owner' && !config.OwnersID.includes(msg.author.id)){
                return;
            }else{
                if(cooldown.has(msg.author.id)){
                    msg.react("⏰");
                }else{
                    command.execute(client, msg, args, config);    
                    if(config.OwnersID.includes(msg.author.id)){
                        return
                    }else{
                        cooldown.add(msg.author.id);
                        setTimeout(() => {cooldown.delete(msg.author.id)}, 5000)
                    }
                }
            }
        }
    })
})



process.stdin.setEncoding('utf8');

process.stdin.on('data', terminalInputRaw => {    
    var terminalInput = terminalInputRaw.replace(/(\r\n|\n|\r|\t)/gm,"");
    var terminalPrefix = "/"
    const args = terminalInput.substring(terminalPrefix.length).split(" ")
    var cmdName = args[0]    
    if(cmdName == "infos"){
        console.log(`\nDiscord : ${Discord.version}\n`)
    }
    if(cmdName == "test"){}
})


module.exports = client