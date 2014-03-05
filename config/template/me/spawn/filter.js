
ColumnFilter = function(columns){
	this.columns=columns;
	this.filterValue=""; 
	var regexMap = {};
	jQuery.each(columns, function(index,value){
		regexMap[value] = new RegExp(value+":([a-z0-9 -]*),{0,1}","i");
	});	
	this.regexMap = regexMap;
	this.charsToStrip = new RegExp('"|\'',"g"); 
};

ColumnFilter.prototype = {
	setFilterValue: function(value){
		this.filterValue=jQuery.trim(value.replace(this.charsToStrip,''));
	},
	match: function(obj){
		var filter=this;
		var matchedColumns = [];
		var objColumns = Object.keys(obj);
		//extract keys from obj that have a regexp to execute
		jQuery.each(objColumns, function(index,value){
			if(filter.regexMap[value] && filter.regexMap[value].test(filter.filterValue)){
				matchedColumns.push(value);
			}
		});
	//if there is no column filter specified in filterValue,then run match against all of this.columns
	var match = true;
	if(matchedColumns.length>0){
		jQuery.each(matchedColumns, function(index,value){
			var regex = filter.regexMap[value];
			var exec = regex.exec(filter.filterValue);
			var filterValue = (exec && exec.length>1? filter.clean(exec[1]): "");
			var objValue = filter.clean(obj[value]);
			match=match && (objValue.indexOf(filterValue)>=0);
		});
	}
	else{
		var filterValue = this.clean(this.filterValue);
		var objValue = "";
		jQuery.each(this.columns, function(index,value){
			objValue+=obj[value];
		});
		objValue=this.clean(objValue);
		match= match && (objValue.indexOf(filterValue)>=0);
	}			
	return match;
	},
	clean: function(value){
		var splitArr = value.split(" ");
		var trimArr = jQuery.map(splitArr, function(item){
			return jQuery.trim(item);
		});
		var cleanValue = "";
		jQuery.each(trimArr, function(index,value){
			if(value && value!=""){
				cleanValue+=" "+value;
			}
		});
		cleanValue=jQuery.trim(cleanValue);
		return cleanValue;
	}
};

