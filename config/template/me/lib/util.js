var firstKey = function(o) {
	for (var key in o) return key;
};

var decodeParams = function() {
    var params = {};
    var kvs = window.location.search.substring(1).split('&');
    for (var i=0; i<kvs.length; i++) {
        var kv = kvs[i].split('=');
        params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
    }
    return params;
};
