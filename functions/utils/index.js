/**
 * Choose a random key in a array
 * @param {*} array 
 */
async function takeRandom(array){
    return new Promise(async function(resolve, reject){
        if(!Array.isArray(array)) throw new Error("This not an array !")

        var i = Math.floor(Math.random() * array.length)
        var chosen = array[i]
        resolve(chosen)
    })
}


module.exports = {
    takeRandom
}