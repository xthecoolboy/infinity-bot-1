const Discord = require("discord.js"),
fs = require("fs")

exports.execute = (client, msg, args, config) => {
    
    msg.delete().catch(() => {});

    loadCmds()
    loadDbs()
    msg.channel.send({
        embed : {
            author : {
                name : "Refresh",
                icon_url : client.user.avatarURL()
            },
            description : "All Commands & databases are reloaded !"
        }
    })

    setTimeout(() => {console.clear()}, 1500)

    function loadCmds(){
        client.commands = [];
        fs.readdir("./commands/", (err, files) => {
            if(err) console.log(err);
            files.forEach(f => {
                delete require.cache[require.resolve(`../commands/${f}`)];
                const cmd = require(`../commands/${f}`);
                const cmdName = f.split(".")[0];
                console.log(`Command loaded : ${cmdName}`);
                client.commands.push(cmd);
            })
        });
    }

    function loadDbs(){
        client.databases = [];
        fs.readdir("./database/", (err, files) => {
            if(err) console.log(err);
            files.forEach(f => {
                delete require.cache[require.resolve(`../database/${f}`)];
                const dbName = f.split(".")[0];
                const db = require(`../database/${f}`)
                console.log(`Db loaded : ${dbName}`);
                client.databases.push(db);
            })
        });
    }
}

exports.info = {
    name : "refresh",
    alias : [],
    perm : "owner"
}

exports.help = {
    desc : "Refresh commands and databases",
    usage : "/",
    ex : "/",
    cat : "owner"
}