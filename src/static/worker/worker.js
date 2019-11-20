
onmessage = function(event) {
    var n = parseInt(event.data, 10);
    postMessage(n);
};