
var markovMap = {};

function populateMap(source){
    markovMap = {}; // start fresh
    var s = source.replace(/\s+/g, " "); // turn all whitespace into a single space.
    var words = s.split(" ");
    var w1 = words.shift()
    var w2 = words.shift()
    var l = words.length;
    for (var i = 0; i < l; i++){
        wx = words[i];
        insertElement(w1,w2,wx);
        w1 = w2;
        w2 = wx;
    }
}

function insertElement(w1, w2, wx) {
    if (!(w1 in markovMap)){
        markovMap[w1] = {}
    }
    if (!(w2 in markovMap[w1])) {
        markovMap[w1][w2] = [];
    }
    markovMap[w1][w2].push(wx);
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

function getNextWord(w1, w2) {
    if (!(w1 in markovMap)) {
        return pickRandomProperty(markovMap);
    }
    obj1 = markovMap[w1];
    if (!(w2 in obj1)) {
        return pickRandomProperty(obj1);
    }

    return pickRandomWord(obj1[w2]);
}

function generate(amount){
    var result = [];
    var w1 = pickRandomProperty(markovMap);
    var obj1 = markovMap[w1];
    var w2 = pickRandomProperty(obj1);
    var lines = 1;
    for (var x = 0; x < amount; ++x) {
        var wx = getNextWord(w1,w2);
        result.push(wx);
        if ((x+1) % 17 == 0){
            result.push("<BR/>");
            if (lines++ % 5 == 0){
                result.push("<BR/>");
            }
        }
        w1 = w2;
        w2 = wx;
    }
    
    return result.join(" ");
}

function generateText(source, amount) {
    populateMap(source);
    return generate(amount);
}


