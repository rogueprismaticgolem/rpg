
var markovMap = {};

function populateMap(source, chainlength){
    markovMap = {}; // start fresh
    var s = source.replace(/\s+/g, " "); // turn all whitespace into a single space.
    var words = s.split(" ");
    var keys = [];

    if (words.length <= chainlength){
        throw "Chain Length is too short at " + chainlength + " with " + words.length + " words in the source.";
    }

    for (var j = 0; j < chainlength; ++j){
        keys.push(words.shift());
    }
    var l = words.length;
    for (var i = 0; i < l; i++){
        wx = words[i];
        insertElement(keys,wx);
        keys.shift();
        keys.push(wx);
    }
}

function insertElement(keys, wx, chainlength) {
    var obj = markovMap;
    for (var i = 0; i < keys.length - 1; ++i) {
        var key = keys[i];
        if (!(key in obj)) {
            obj[key] = {}
        }
        obj = obj[key];
    }

    var lastKey = keys[keys.length -1];
    if (!(lastKey in obj)){
        obj[lastKey] = [];
    }

    obj[lastKey].push(wx);
}

// This comes from here:
// http://stackoverflow.com/a/2532251
function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
}

function pickRandomWord(arr) {
    var result;
    var count = 0;
    for (var x = 0; x < arr.length; ++x) {
        if (Math.random() < 1/++count)
            result = arr[x];
    }
    return result;
}

function pickRandom(thing){
    if (Array.isArray(thing))
            return pickRandomWord(thing);
    return pickRandomProperty(thing);
}

function getNextWord(keys) {
    var obj = markovMap;
    
    for (var i = 0; i<keys.length; ++i){
        var key = keys[i];
        if (!(key in obj)){
            return pickRandom(obj);
        }
        obj = obj[key];
    }

    return pickRandom(obj)
}

function generate(amount, chainlength){
    var result = [];
    var keys = [];

    keys.push(pickRandom(markovMap));

    var lines = 1;
    for (var x = 0; x < amount; ++x) {
        var wx = getNextWord(keys);
        result.push(wx);
        if ((x+1) % 13 == 0){
            result.push("<BR/>");
            if (lines++ % 5 == 0){
                result.push("<BR/>");
            }
        }
        keys.push(wx);
        while (keys.length > chainlength){
            keys.shift();
        }
    }
    
    return result.join(" ");
}

function generateText(source, amount, chainlength) {
    var cl = 2;
    if (chainlength){
        cl = chainlength;
    }
    populateMap(source, cl);
    return generate(amount, cl);
}


