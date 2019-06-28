
/*
    This Discord Bot is developed by JockeRider199#2627 for Discord Hack Week.
*/

/////////////////////////////////REQUIREMENTS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const Discord = require("discord.js"),
ms = require("ms"),
client = new Discord.Client(),
config = require("./config.json"),
chalk = require("chalk"),
moment = require("moment"),
fs = require("fs"),
low = require("lowdb"),
FileSync = require("lowdb/adapters/FileSync"),
npmPackage = require("./package.json");

moment.locale("en")
var cooldown = new Set()

/////////////////////////////////FUNCTIONS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var logger = require("./functions/console-logger");
var selfbots = require("./functions/selfbot");
var utils = require("./functions/utils");

//

function consoleConnect(){
    console.log("\n-------------------------------------------------")
    console.log(chalk.blue(`--> Discord Bot by JockeRider199`))
    console.log(chalk.green(`--> Connected to Discord's API`))
    console.log("-------------------------------------------------")
    console.log(`--> Bot Name :      [ ${client.user.tag} ]`)
    console.log(`--> Bot ID :        [ ${client.user.id} ]`)
    console.log(`--> Commands size : [ ${client.commands.length} ]`)
    console.log(`--> Bot's prefix :  [ ${config.prefix} ]`)
    console.log(`--> Guilds size :   [ ${client.guilds.size} ]`)
    console.log(`--> Bot's version : [ ${npmPackage.version} ]`)
    console.log("-------------------------------------------------")
    console.log(chalk.green(`=> READY\n`))
}

/////////////////////////////////COMMANDS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
function loadCmds(){
    client.commands = [];
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
        if(err) console.log(err);
        files.forEach(f => {
            delete require.cache[require.resolve(`./database/${f}`)];
            const dbName = f.split(".")[0];
            const db = require(`./database/${f}`)
            //console.log(`Db loaded : ${dbName}`);
            client.databases.push(db);
        })
    });
};

/////////////////////////////////LOGIN\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
client.login(config.token);

client.on("ready", () => {
    if(Discord.version != "12.0.0-dev"){
        logger.alert("This is not the 12.0.0 discord.js !")
        return client.destroy()
    }
    loadCmds()
    loadDbs()
    setTimeout(() => {
        console.clear()
        consoleConnect()
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

client.on("guildMemberAdd", member => {
    var adapter = new FileSync("./database/modules.json")
    var modules = low(adapter)

    if(!modules.has(member.guild.id).value() || modules.get(member.guild.id).get("enableCaptcha").value() != true) return;

    var adapter2 = new FileSync("./database/captcha.json");
    var db = low(adapter2)

    var channel = member.guild.channels.get(db.get("guilds").get(member.guild.id).get("channel").value())
    var role = member.guild.roles.get(db.get("guilds").get(member.guild.id).get("role").value())

    if(
        !channel ||
        !role
    ) return;

    member.roles.add(role.id).then(() => {
        var embed = new Discord.MessageEmbed()
            .setColor(config.embed.color)
            .setAuthor("Captcha", client.user.avatarURL())
            .setTitle(`Welcome in this server ${member.user.username} !`)
            .setDescription(`Please made the command : \`${config.prefix}verif\` to get your captcha code.\nAnd then, send the command : ${config.prefix}verif <your_code> in this channel`)
            .setFooter(config.embed.footer)
        channel.send(embed);

        setTimeout(() => {
            if(member.roles.has(role.id)) member.kick("Captcha Timeout")
        }, ms("10min"))
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
    if(cmdName == "eval"){
        try{
            let codein = args.slice(1).join(" ")
            let code = eval(codein)
            if(typeof code != "string") code = require("util").inspect(code)
            console.log(code)
        }catch(e){
            console.error(e)
        }
    }
})


module.exports = client
