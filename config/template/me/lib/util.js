var util = {
    firstKey : function(o) {
    	for (var key in o) return key;
    },

    getUrlParamMap : function() {
        var params = {};
        var kvs = window.location.search.substring(1).split('&');
        for (var i=0; i<kvs.length; i++) {
            var kv = kvs[i].split('=');
            params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
        }
        return params;
    },

    ajax : function (args) {
        if (!args) throw "missing args parameter";
        jQuery.ajax({
            url: args.url,
            type: args.method || "GET",
            crossDomain: true,
            data: args.data,
            dataType: "json",
            success: function (response) {
                if (args.onDone) {
                    args.onDone(response, args);
                } else {
                    console.log(['rpc.done', args, response]);
                }
            },
            error: function (xhr, status) {
                if (args.onError) {
                    args.onError(xhr, status, args);
                } else {
                    console.log(['rpc.error', args, xhr, status]);
                }
            }
        });
    },

    ajaxSetup : function() {
        jQuery.ajaxSetup({
            converters:{"text json":function(json) {
                return eval('('+json+')');
            }}
        });
    }
};
