const Discord = require("discord.js");
const config = require("../config.json");

exports.execute = (client, msg, args, config) => {

    msg.delete().catch(() => {});

    let u = convertMS(client.uptime);
    let uptime = u.h + "h " + u.m + "m " + u.s + "s"

    var embed = new Discord.MessageEmbed()
        .setColor(config.embed.color)
        .setAuthor(`Stats of ${client.user.username}`, client.user.avatarURL())
        .addField(config.emojis.graph + " Statistics", `\`Servers : ${client.guilds.size}\nUsers : ${client.users.size}\``, true)
        .addField(config.emojis.gear + " Versions", `\`Discord.js : ${Discord.version}\nNodejs : ${process.versions.node}\``, true)
        .addField(config.emojis.processor + " RAM usage", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\``, true)
        .addField(config.emojis.hourglass + " Uptime", `\`${uptime}\``)
        .setFooter(config.embed.footer)
    msg.channel.send(embed)
}

exports.info = {
    name : "stats",
    alias : [],
    perm : "owner"
}

exports.help = {
    desc : "Give bot's stats",
    usage : config.prefix + "stats",
    ex : "/",
    cat : "info"
}

function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return {
        d: d
        , h: h
        , m: m
        , s: s
    };
};
