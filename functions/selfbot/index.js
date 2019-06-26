const Discord = require("discord.js");

module.exports = {level}
/**
 * Check a user and a message to get a level of dangerousness
 * @param {object} user The user object to check
 * @param {string} content The message content to check (optional)
 * @param {string} nonce The message signature (optional)
 */

async function level(user, content, nonce){
    let level = 0;
    // Check the username
    let username = /^[a-z]+[0-9]+$/;
    if(user.username.match(username)) level++;
    // Check the avatar
    let avatar = user.avatar;
    if(!avatar) level++;
    // Check the creation date
    let creationDate = user.createdTimestamp;
    if(creationDate > (Date.now()-259200000)) level++;
    // Check the message content
    if(content){
        if(content.includes("https://")) level++;
        if(content.includes("hotos")) level = level+2;
    }
    // Check if the user is on mobile (some users on mobile devices don't send a signature)
    let devices = user.presence.clientStatus, isMobile = false;
    if(devices) for(let device in user.presence.clientStatus) if(device === "mobile") isMobile = true;
    // Check the message signature
    if(typeof nonce === "object" && !isMobile) level++
    return level;
}