$(document).ready(on_ready);

var db = localStorage;

function decode(str) {
    return eval('('+str+')');
}

function on_ready() {
    if (!db.account) {
        db.account = prompt("Account ID");
        location.reload();
    } else {
        account.get();
    }
}

var clusterNode = null;
var clusterStyle = null;
var clusterSelect = db['select-cluster'];
var clusterConfig = null;
var clusterTemplate = null;
var clusterData = null;

var util = {
    count_keys:function(o) {
        var i=0;
        for (var key in o) i++;
        return i;
    },
    tag:function(name,kv) {
        var html = ["<",name];
        for (var key in kv) {
            html.push(" ");
            html.push(key);
            html.push("='");
            html.push(kv[key]);
            html.push("'");
        }
        html.push(">");
        return html.join('');
    },
    clearRightPanel:function() {
        $('#right-title').html('');
        $('#right-body').html('');
        $('#right-footer').html('');
    }
};

var account = {
    reset:function() {
        db.account = '';
        location.reload();
    },

    get:function(callback) {
        cluster.render(null);
        $.ajax({
            url:"/api/get_account",
            data:{id:db.account},
            success:function(data,status,xhr) {
                account.render(decode(data));
                if (callback) callback();
            },
            error:function(xhr,status,error) {
                db.account='';
                location.reload();
            }
        });
    },

    render:function(account) {
        var html = ["<ul id='account'>"];
        var clusters = account.clusters;
        for (var i=0; i<clusters.length; i++) {
            html.push('<li>');
            html.push('<a id="');
            html.push(clusters[i]);
            html.push('" onclick=\'cluster.select(this)\'>');
            html.push(clusters[i]);
            html.push('</a>');
            html.push('</li>');
        }
        html.push("</ul>");
        $('#left-body').html(html.join(''));
        if (clusterSelect) {
            cluster.select($('#'+clusterSelect)[0]);
            clusterSelect = null;
        }
        for (var i=0; i<clusters.length; i++) {
            (function(){
                var cid = clusters[i];
                $.ajax({
                    url:"/api/get_cluster",
                    data:{id:clusters[i]},
                    success:function(data,status,xhr) {
                        data = decode(data);
                        var about = data.about;
                        $('#'+cid).html(about.length < 30 ? about : about.substring(0,30)+"...");
                    }
                });
            })();
        }
    }
};

var cluster = {
    select:function(node) {
        if (node != null && node != clusterNode) {
            if (clusterNode != null) clusterNode.style['background-color'] = clusterStyle;
            clusterNode = node;
            clusterStyle = node.style['background-color'];
            node.style['background-color'] = '#ddd';
        }
        $.ajax({
            url:"/api/get_cluster",
            data:{id:node.id},
            success:function(data,status,xhr) {
                util.clearRightPanel();
                cluster.render(decode(data));
                db['select-cluster'] = clusterNode.id;
            },
            error:function(xhr,status,error) {
                alert("Failure Retrieving Cluster Info: "+error);
            }
        });
    },

    render:function(cluster) {
        if (!cluster) {
            $('#cluster').hide();
            return;
        }
        clusterData = cluster;
        db['cluster-'+clusterNode.id] = JSON.stringify(cluster);
        $('#cluster').show();
        $('#cluster-about').html(clusterData.about || clusterNode.id);
        /* render node type count requirements */
        var html = [];
        for (var key in cluster.require) {
            if (cluster.require[key] == 0) continue;
            html.push(util.tag("button",{onclick:"cluster.setRequired(\""+key+"\")"}));
            html.push(key+":"+cluster.require[key]+"</button>");
        }
        html.push(util.tag("button",{onclick:"cluster.addRequired()"}));
        html.push("+");
        html.push("</button>");
        $("#cluster-required").html(html.join(''));
        /* render named node configurations */
        var html = [];
        for (var key in cluster.proc) {
            if (cluster.proc[key] == 0) continue;
            html.push(util.tag("button",{onclick:"cluster.showRegistered(\""+key+"\")"}));
            html.push(key+":"+util.count_keys(cluster.proc[key])+"</button>");
        }
        if (html.length > 0) {
            html.push(util.tag("button",{onclick:"cluster.clearRegistered()"}));
            html.push("-");
            html.push("</button>");
        }
        $("#cluster-registered").html(html.join(''));
        /* render node type process lists */
        var html = [];
        for (var key in cluster.node) {
            html.push(util.tag("button",{onclick:"cluster.showTemplate(\""+key+"\")"}));
            html.push(key+"</button>");
        }
        html.push(util.tag("button",{onclick:"cluster.addTemplate()"}));
        html.push("+");
        html.push("</button>");
        $("#cluster-templates").html(html.join(''));

        /* render process type configurations */
        var html = [];
        for (var key in cluster.config) {
            html.push(util.tag("button",{onclick:"cluster.showConfiguration(\""+key+"\")"}));
            html.push(key+"</button>");
        }
        html.push(util.tag("button",{onclick:"cluster.addConfiguration()"}));
        html.push("+");
        html.push("</button>");
        $("#cluster-configs").html(html.join(''));


        $("#cluster-set-local").html("local : "+clusterData.isLocal);
        $("#cluster-set-naming").html("short host names : "+clusterData.shortenHost);
        $.ajax({
            url:"/render/hint",
            data:{cluster:clusterNode.id},
            success:function(data,status,xhr) {
                $('#cluster-hint').html(data);
            },
            error:function(xhr,status,error) {
                alert("Failure Hinting Cluster: "+error);
            }
        });
    },

    update:function(callback) {
        $.ajax({
            url:"/api/update_cluster",
            data:{account:db.account,cluster:clusterNode.id,data:JSON.stringify(clusterData)},
            success:function(data,status,xhr) {
                cluster.select(clusterNode);
                if (callback) callback();
            },
            error:function(xhr,status,error) {
                alert("Failure Updating Cluster: "+error);
            }
        });
    },

    manage:function() {
        window.open('http://{{boothost}}/me/spawn/spawn.html?cluster='+clusterNode.id,'_spawn_'+clusterNode.id);
    },

    setAbout:function() {
        var newAbout = prompt("Describe this cluster",clusterData.about || clusterNode.id);
        if (newAbout || newAbout == '') {
            clusterData.about = newAbout;
            cluster.update();
        }
    },

    setAuthKey:function() {
        var newAuthKey = prompt("Set WEB API Auth Key",clusterData.authKey || clusterNode.id);
        if (newAuthKey || newAuthKey == '') {
            clusterData.authKey = newAuthKey;
            cluster.update();
        }
    },

    setImageRoot:function() {
        var newImageRoot = prompt("Set Image Root URL. Leave blank to accept default.",clusterData.imageRoot);
        if (newImageRoot || newImageRoot == '') {
            clusterData.imageRoot = newImageRoot;
            cluster.update();
        }
    },

    setLocal:function() {
        var local = prompt("Is this a local stack?", clusterData.isLocal);
        if (local) {
            clusterData.isLocal = (local == 'true' || local == '1');
            cluster.update();
        }
    },

    setShortHost:function() {
        var shorten = prompt("Shorten node host names?", clusterData.shortenHost);
        if (shorten) {
            clusterData.shortenHost = (shorten == 'true' || shorten == '1');
            cluster.update();
        }
    },

    addRequired:function() {
        var required = prompt("Enter process name requirement");
        if (required && !clusterData.require[required]) {
            clusterData.require[required] = 1;
            cluster.setRequired(required);
        }
    },

    setRequired:function(require) {
        var newRequired = prompt("Enter required number of "+require+" nodes for this cluster", clusterData.require[require]);
        if (newRequired) {
            clusterData.require[require] = parseInt(newRequired);
            cluster.update();
        }
    },

    clearRegistered:function() {
        if (confirm("Delete all registered node data?")) {
            clusterData.proc = 'delete';
            cluster.update();
        }
    },

    showRegistered:function(registered) {
        var nodes = clusterData.proc[registered];
        $('#right-title').html(registered+" nodes");
        var html = ['<table>'];
        for (var key in nodes) {
            html.push('<tr><td>');
            html.push(key);
            html.push('</td><td>');
            html.push(nodes[key].ip);
            html.push('</td><td>');
            html.push(new Date(nodes[key].updated).toString('yy/MM/dd HH:mm'));
            html.push('</td></tr>');
        }
        html.push('</table>');
        $('#right-body').html(html.join(''));
        $('#right-footer').html("<button onclick='cluster.clearRegistered()'>clear nodes</button>");
    },

    addConfiguration:function() {
        console.log("add config");
        var newConfigName = prompt("Enter New Configuration Name");
        if (newConfigName && !clusterData.config[newConfigName]) {
            clusterData.config[newConfigName] = {};
            cluster.update();
        }
    },

    showConfiguration:function(config) {
        clusterConfig = config;
        var opts = clusterData.config[clusterConfig];
        $('#right-title').html(config+" configuration");
        var html = ['<table>'];
        for (var key in opts) {
            var val = opts[key];
            if (val.length > 30) val = val.substring(0,27)+"...";
            html.push('<tr><th><button onclick="cluster.editConfigKey(this)">');
            html.push(key);
            html.push('</button></th><th>')
            html.push(val);
            html.push('</th></tr>');
        }
        html.push("<tr><th><button onclick='cluster.addConfigKey()'>+</button></th></tr>")
        html.push('</table>');
        $('#right-body').html(html.join(''));
        $('#right-footer').html("<button onclick='cluster.deleteConfiguration()'>delete configuration</button>");
    },

    deleteConfiguration:function() {
        if (clusterConfig && confirm("Are you sure you want to delete this configuration?")) {
            delete clusterData.config[clusterConfig];
            cluster.update();
        }
    },

    editConfigKey:function(button) {
        var opts = clusterData.config[clusterConfig];
        var key = button.innerText;
        var newValue = prompt("Value for "+key, opts[key]);
        if (newValue == null) return;
        if (newValue.length > 0) {
            opts[key] = newValue;
            cluster.update(function() {
                cluster.showConfiguration(clusterConfig);
            });
        } else {
            delete opts[key];
            cluster.update(function() {
                cluster.showConfiguration(clusterConfig);
            });
        }
    },

    addConfigKey:function() {
        var opts = clusterData.config[clusterConfig];
        var newKey = prompt("Name of new config key");
        if (newKey && newKey.length > 0 && !clusterConfig[newKey]) {
            var newValue = prompt("Value for "+newKey);
            if (newValue && newValue.length > 0) {
                opts[newKey] = newValue;
                cluster.update(function() {
                    cluster.showConfiguration(clusterConfig);
                });
            }
        }
    },

    addTemplate:function() {
        var template = prompt("Enter node template name");
        if (template && !clusterData.node[template]) {
            clusterData.node[template] = { process:[],image:clusterData.node["defaults"].image };
            cluster.update(function() {
                cluster.showTemplate(template);
            });
        }
    },

    showTemplate:function(templateName){
        clusterTemplate = templateName;
        var template = clusterData.node[templateName];
        $('#right-title').html(templateName+" template");
        var html = ['<table id="node-template">'];
        html.push("<tr><th>processes</th></tr>");
        html.push("<tr><th><textarea id='template-processes' rows='5' cols='35'>");
        html.push(template.process.join("\n"));
        html.push("</textarea></th></tr>");
        html.push("<tr><th>files</th></tr>");
        html.push("<tr><th><textarea id='template-files' rows='5' cols='35'>");
        html.push(template.image.join("\n"));
        html.push("</textarea></th></tr>");
        html.push('</table>');
        $('#right-body').html(html.join(''));
        $('#right-footer').html("<button onclick='cluster.saveTemplate()'>save</button><button onclick='cluster.deleteTemplate()'>delete template</button>");
    },

    saveTemplate:function() {
        var template = clusterData.node[clusterTemplate];
        template.process = $('#template-processes').val().split('\n');
        template.image = $('#template-files').val().split('\n');
        cluster.update();
    },

    deleteTemplate:function() {
        if (clusterTemplate != 'defaults' && confirm("Are you sure you want to delete this template?")) {
            delete clusterData.node[clusterTemplate];
            cluster.update();
        }
    },

    add:function() {
        $.ajax({
            url:"/api/create_cluster",
            data:{account:db.account},
            success:function(data,status,xhr) {
                clusterSelect = decode(data).cluster;
                account.get();
            },
            error:function(xhr,status,error) {
                alert("Failure Creating Cluster: "+error);
            }
        });
    },

    delete:function() {
        if (clusterNode == null) return alert("no cluster selected");
        if (prompt("Are you sure you want to delete this cluster? Type 'YES' to confirm", "NO, my bad") != "YES") return;
        $.ajax({
            url:"/api/delete_cluster",
            data:{account:db.account,cluster:clusterNode.id},
            success:function(data,status,xhr) {
                account.get();
            },
            error:function(xhr,status,error) {
                alert("Failure Deleting Cluster: "+error);
            }
        });
    },

    clone:function() {
        if (clusterNode == null) return alert("no cluster selected");
        if (!confirm("Clone this cluster?")) return;
        var clusterSave = clusterData;
        $.ajax({
            url:"/api/create_cluster",
            data:{account:db.account},
            success:function(data,status,xhr) {
                clusterSelect = decode(data).cluster;
                account.get(function() {
                    clusterData = clusterSave;
                    clusterData.about = "CLONED "+clusterData.about;
                    cluster.update();
                });
            },
            error:function(xhr,status,error) {
                alert("Failure Cloning Cluster: "+error);
            }
        });
    }
};