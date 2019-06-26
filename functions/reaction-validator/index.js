const discord = require("discord.js"),
ms = require("ms");


/**
 * Create a discord reaction message validator 
 * @param {object} msg The message whose bot will answer
 * @param {object} options The options of the validator
 */

async function create(msg, options){
    return new Promise(async function(resolve, reject){
        if(!msg) throw new Error("Message not specified !")
        if(!options) throw new Error("Options not specified")

        var embed = new discord.MessageEmbed()
        .setColor(options.embed.color)
        .setTitle(options.embed.title)
        .setDescription(options.embed.description)
        .setFooter(options.embed.footer)

        var sMsg = await msg.channel.send(embed)
        await sMsg.react(options.reactionOk)
        await sMsg.react(options.reactionNo)


        var filter = (reaction, user) => user.id == msg.author.id
        var collector = sMsg.createReactionCollector(filter, {time : options.time})

        collector.on("collect", async (reaction) => {
            if(reaction.emoji.name == options.reactionOk){
                collector.stop()
                if(options.deleteOnChoose == true){
                    sMsg.delete()
                }
                resolve("ok")
            }
            if(reaction.emoji.name == options.reactionNo){
                collector.stop()
                if(options.deleteOnChoose == true){
                    sMsg.delete()
                }
                resolve("no")
            }
        })
    })
}

module.exports = {create}



// ZONE TESTS


options = {
    reactionOk : "",
    reactionNo : "",
    deleteOnChoose : "",
    time : ms("temps"),
    embed : {
        color : "",
        title : "",
        description : "",
        footer : ""
    }
}
