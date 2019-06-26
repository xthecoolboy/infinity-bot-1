const chalk = require("chalk");
const moment = require("moment")

module.exports = {
    warn, alert, sucess, log
}

/**
 * Warn in the console
 * @param {string} log Message to log
 */
async function warn(log){
    console.log(chalk.red(log))
}


/**
 * Alert in the console
 * @param {string} log Message to log
 */
async function alert(log){
    console.log(chalk.red.underline.bold(log))
}


/**
 * Send sucess message in the console
 * @param {string} log  Message to log
 */
async function sucess(log){
    console.log(chalk.green(log))
}


/**
 * Log a message with precise hour and date
 * @param {string} log Message to log
 * @param {string} timezone Timezone (fr, en, ...)
 */
async function log(log, timezone){
    moment.locale(timezone)
    console.log(moment().format("LTS") + " | " + moment().format("L") + " => " + log)
}