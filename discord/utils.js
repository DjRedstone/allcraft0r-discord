/**
 * Just wait
 * @param ms {Number} Waiting time (in milisecond)
 * @return {Promise<void>}
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Return all chars of a string
 * @param s {String} The string
 * @return {Set<String>} The chars
 */
function getChars(s) {
    const res = new Set();
    for (const char of s) {
        res.add(char);
    }
    return res;
}

module.exports = { delay, getChars }