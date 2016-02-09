var ticks = 0;
var interval;
window.onload = function(){
    Gadion();
    interval = setInterval(Gadion, 30 * 1000)
};

function Gadion() {
    var names = ["Gadeon","Gadion","Gadreon","Gadeone","Gadione", "Gadeion"];
    var nLen = names.length;
    spans = document.getElementsByClassName("gdn");
    for (var i = 0; i < spans.length; i++) {
      spans[i].innerHTML = names[Math.floor(Math.random() * nLen)];
      console.log(names[Math.floor(Math.random() * nLen)]);
    }

    ticks += 1;
    if (ticks >= 10) {
        clearInterval(interval);
        console.log("Stopped");
    }
};
