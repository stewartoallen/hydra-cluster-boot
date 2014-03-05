// var flowData = '{"dependencies":[{"dependency":"e92009c9-0bfc-4019-828b-3a4f84665aa3","dependent":"c2c237fc-5ed0-46f3-8418-e5f893594e61"},{"dependency":"e92009c9-0bfc-4019-828b-3a4f84665aa3","dependent":"68fc6487-5c78-4cfd-b8c7-420a1db5d67a"},{"dependency":"2c2eb536-3d4d-44de-81d5-f1c30511ea97","dependent":"13cb6cce-f54f-4078-bf77-4e4c8e736304"},{"dependency":"2c2eb536-3d4d-44de-81d5-f1c30511ea97","dependent":"fcd3cc0c-1507-4b13-b0e8-5d85d9371d2f"},{"dependency":"2c2eb536-3d4d-44de-81d5-f1c30511ea97","dependent":"e92009c9-0bfc-4019-828b-3a4f84665aa3"}],"flow_id":"2c2eb536-3d4d-44de-81d5-f1c30511ea97","layouttimestamp":0,"nodes":[{"name":"13cb6cce-f54f-4078-bf77-4e4c8e736304","status":"IDLE","x":-780,"y":0},{"name":"68fc6487-5c78-4cfd-b8c7-420a1db5d67a","status":"IDLE","x":-260,"y":0},{"name":"c2c237fc-5ed0-46f3-8418-e5f893594e61","status":"IDLE","x":0,"y":0},{"name":"e92009c9-0bfc-4019-828b-3a4f84665aa3","status":"IDLE","x":-390,"y":120},{"name":"fcd3cc0c-1507-4b13-b0e8-5d85d9371d2f","status":"IDLE","x":260,"y":0},{"name":"2c2eb536-3d4d-44de-81d5-f1c30511ea97","status":"IDLE","x":-130,"y":240}],"timestamp":0}';
// var flowGraph;
// $(document).ready(function(){
// 	// var flowData = '{"dependencies":[{"dependency":"n2","dependent":"n4"},{"dependency":"n4","dependent":"n5"},{"dependency":"n4","dependent":"n6"},{"dependency":"n3","dependent":"n5"},{"dependency":"n3","dependent":"n6"},{"dependency":"n6","dependent":"n1"},{"dependency":"n1","dependent":"n5"},{"dependency":"n1","dependent":"n3"},{"dependency":"n1","dependent":"n2"}],"flow_id":"n4","layouttimestamp":0,"nodes":[{"name":"n5","status":"IDLE","x":-225,"y":0},{"name":"n2","status":"IDLE","x":-45,"y":480},{"name":"n4","status":"IDLE","x":0,"y":360},{"name":"n3","status":"IDLE","x":45,"y":0},{"name":"n6","status":"IDLE","x":45,"y":240},{"name":"n1","status":"IDLE","x":-45,"y":120}],"timestamp":0}';
// 	// var flowData = '{"dependencies":[{"dependency":"e92009c9-0bfc-4019-828b-3a4f84665aa3","dependent":"c2c237fc-5ed0-46f3-8418-e5f893594e61"},{"dependency":"e92009c9-0bfc-4019-828b-3a4f84665aa3","dependent":"68fc6487-5c78-4cfd-b8c7-420a1db5d67a"},{"dependency":"2c2eb536-3d4d-44de-81d5-f1c30511ea97","dependent":"13cb6cce-f54f-4078-bf77-4e4c8e736304"},{"dependency":"2c2eb536-3d4d-44de-81d5-f1c30511ea97","dependent":"fcd3cc0c-1507-4b13-b0e8-5d85d9371d2f"},{"dependency":"2c2eb536-3d4d-44de-81d5-f1c30511ea97","dependent":"e92009c9-0bfc-4019-828b-3a4f84665aa3"}],"flow_id":"2c2eb536-3d4d-44de-81d5-f1c30511ea97","layouttimestamp":0,"nodes":[{"name":"13cb6cce-f54f-4078-bf77-4e4c8e736304","status":"IDLE","x":-780,"y":0},{"name":"68fc6487-5c78-4cfd-b8c7-420a1db5d67a","status":"IDLE","x":-260,"y":0},{"name":"c2c237fc-5ed0-46f3-8418-e5f893594e61","status":"IDLE","x":0,"y":0},{"name":"e92009c9-0bfc-4019-828b-3a4f84665aa3","status":"IDLE","x":-390,"y":120},{"name":"fcd3cc0c-1507-4b13-b0e8-5d85d9371d2f","status":"IDLE","x":260,"y":0},{"name":"2c2eb536-3d4d-44de-81d5-f1c30511ea97","status":"IDLE","x":-130,"y":240}],"timestamp":0}';
// 	flowGraph = new FlowGraph("graph","graphContent");
// 	flowGraph.loadFlow(flowData);
// 	flowGraph.resetTransform();
// 	flowGraph.setupZoomBar();
// });


FlowGraph = function(svgId,contentId, nodeDetailsMap){
	this.svgns = "http://www.w3.org/2000/svg";
	this.svgId=svgId;
	this.currentGraph=null;
	this.svgElement=document.getElementById(svgId);	
	this.zoomMode=true;
	this.isMouseDown = false;
	this.mouseX=0;
	this.mouseY=0;
	this.moveNode = false;
	this.saveYPos = 0;
	this.mouseInside = false;
	this.contentId=contentId;

	this.pickerPos=100;	
	this.zoomBar=null;
	this.zoomPicker=null;
	this.zoomLine=null;
	this.zoomPlus=null;
	this.zoomMinus=null;
	this.zoomSlider=null;
	this.zoomHeight = 200;
	this.radius = 12;
	this.saveYPos=100;
	this.nodeDetailsMap = nodeDetailsMap;
	this.nodeStates = ["idle","scheduled","running","degraded","unknown","ERROR", "REBALANCE", "queued", "migrating"]; //FIXME: not ideal
};

FlowGraph.prototype = {
	loadFlow: function(flow){
		var svgGraph = new SVGGraph();
		svgGraph.initGraph();
	 
		this.attachGraph(svgGraph);
		//var flow = jQuery.parseJSON(flowdata);
		for(var i=0; i < flow.nodes.length; i++) {
			var flowNode = flow.nodes[i];
			if (flowNode != null) {
				// var id = (flowNode.name.length>7? flowNode.name.substr(0,6)+'...': flowNode.name);//shorten name				
				// var node = svgGraph.createNode(flowNode.name, id, flowNode.x, flowNode.y, flowNode.status);			
				var id = flowNode.name;
				var name= this.nodeDetailsMap[id]["description"];		
				var label = (name.length > 30? name.substr(0,29)+"...": name);
				var status = this.nodeStates[this.nodeDetailsMap[id]["state"]] || "unkown";	
				var node = svgGraph.createNode(id, label, flowNode.x, flowNode.y, status);		
				this.currentGraph.setEnabledNode(node, true);
			}
		}	

		for (var i=0; i < flow.dependencies.length; i++) {
			var edge = flow.dependencies[i];
			svgGraph.createEdge(edge.dependency, edge.dependent, edge.status);
		}
		
		// this.resetTransform();
	},
	attachGraph: function(svgGraph){
		if (this.currentGraph) {
			this.currentGraph.dettachGraph();
		}

		this.currentGraph = svgGraph;
		svgGraph.attachGraph(this.svgElement);
	},
	resetTransform: function(){
		if (this.currentGraph) {
			var content = document.getElementById(this.contentId);
			this.currentGraph.resetTransform(content.clientWidth,content.clientHeight);
		}
	},
	cancelEvent: function(e) {
		e = e ? e : window.event;
		if (e.stopPropagation()) {
			e.stopPropagation();
		}
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.cancel = true;
		e.returnValue = false;
		return false;
	},

	toggleEdit: function() {
		if (editMode) {
			editMode = false;
			setEditMode(editMode);
		}
		else {
			editMode = true;
			setEditMode(editMode);
		}		
	},

	mouseFocus: function(type) {
		mouseInside = (type == 'true');
	},

	zoomGraph: function(evt) {
		if (!mouseInside || !currentGraph) {
			return;
		}
		if (!evt) var evt = window.event;
		
		var delta = 0;
		if (evt.wheelDelta) {
			delta =event.wheelDelta / 120;
		}
		else if (evt.detail) {
			delta = -evt.detail / 3;
		}
		
		var scale = 1;
		if ( delta > 0 ) {
			for (var i = 0; i < delta; ++i) {
				scale *= 1.05;
			}
		}
		else {
			for (var i = 0; i < -delta; ++i) {
				scale *= 0.95;
			}
		}

		var content = document.getElementById(this.contentId);
		var x = evt.pageX - content.offsetLeft;
		var y = evt.pageY - content.offsetTop;
		
		currentGraph.zoomGraphFactor(scale, x, y);	
		updateZoomPicker();
		return cancelEvent(evt);
	},
	setupEditButton: function(svgElement) {
		buttonRow = document.createElementNS(this.svgns, 'g');
		buttonRow.setAttribute('id', 'postgraphButton');
		editButton = document.createElementNS(this.svgns, 'image');
		editButton.setAttribute("x", "0");
		editButton.setAttribute("y", "0");
		editButton.setAttribute("width", "32px");
		editButton.setAttribute("height", "32px");
		editButton.setAttribute("opacity", "0.5");	
		// editButton.setAttributeNS(xlinkns, "xlink:href", contextURL + "/static/editlock.png");				
		editButton.setAttribute("onmouseover", "this.setAttribute('opacity','1.0')");
		editButton.setAttribute("onmouseout","this.setAttribute('opacity','0.5')");
		editButton.setAttribute("onclick", "toggleEdit()");

		buttonRow.appendChild(editButton);
		buttonRow.setAttribute("transform", "translate(3, 470)");
		
		svgElement.appendChild(buttonRow);
	},

	clickZoom: function(zoomFactor) {
		var zoomAmount = 10 * zoomFactor;
		var position = zoomAmount + pickerPos;
		this.moveZoomPicker(position);
	},

	updateZoomPicker: function() {
		if (currentGraph) {
			pickerPos = zoomHeight - zoomHeight * Math.sqrt(currentGraph.getZoomPercent());
			zoomPicker.setAttribute("y", pickerPos - 5);
		}
	},
	moveZoomPicker: function (newpos) {
		this.pickerPos = newpos;
		if (this.pickerPos > this.zoomHeight) {
			this.pickerPos = this.zoomHeight;
		}
		else if (this.pickerPos < 1) {
			this.pickerPos = 1;
		}
		this.zoomPicker.setAttribute("y", this.pickerPos - 5);
		
		if (this.currentGraph) {
			var percent = 1.0 - (this.pickerPos / this.zoomHeight);
			if (percent == 0) {
				percent = 0.0001;
			}
			var content = document.getElementById(this.contentId);
			var py = content.clientHeight/2;
			var px = content.clientWidth/2;
			
			this.currentGraph.zoomGraphPercent(percent*percent, px, py);
		}
	},
	sliderClick: function(evt, item) {
		var graphTab = document.getElementById("graphTab");
		var newDelta = evt.clientY - graphTab.offsetTop - 25;
		
		this.moveZoomPicker(newDelta);
	},
	setupZoomBar: function() {
		this.zoomBar = document.createElementNS(this.svgns, 'g');
		this.zoomBar.setAttribute('id', 'zoomBar');
		
		// The upper plus button
		this.zoomPlus = document.createElementNS(this.svgns, 'g');
		var zoomPlusB = document.createElementNS(this.svgns, 'circle');
		zoomPlusB.setAttribute("cx", 0);
		zoomPlusB.setAttribute("cy", 0);
		zoomPlusB.setAttribute("r", this.radius);
		var plusRect1 = document.createElementNS(this.svgns, 'rect');
		plusRect1.setAttribute("x", -8);
		plusRect1.setAttribute("y", -2);
		plusRect1.setAttribute("width", 16);
		plusRect1.setAttribute("height", 4);
		var plusRect2 = document.createElementNS(this.svgns, 'rect');
		plusRect2.setAttribute("x", -2);
		plusRect2.setAttribute("y", -8);
		plusRect2.setAttribute("width", 4);
		plusRect2.setAttribute("height", 16);
		this.zoomPlus.setAttribute("transform", "translate(12.5, 0)");
		this.zoomPlus.setAttribute("class", "zoomButton");
		this.zoomPlus.setAttribute("onclick", "flowGraph.clickZoom(-1)");
		this.zoomPlus.appendChild(zoomPlusB);
		this.zoomPlus.appendChild(plusRect1);
		this.zoomPlus.appendChild(plusRect2);
		this.zoomBar.appendChild(this.zoomPlus);
		
		// The lower minus button
		this.zoomMinus = document.createElementNS(this.svgns, 'g');
		var zoomMinusB = document.createElementNS(this.svgns, 'circle');
		zoomMinusB.setAttribute("cx",0);
		zoomMinusB.setAttribute("cy",0);
		zoomMinusB.setAttribute("r", this.radius);
		var minusRect = document.createElementNS(this.svgns, 'rect');
		minusRect.setAttribute("x", -8);
		minusRect.setAttribute("y", -2);
		minusRect.setAttribute("width", 16);
		minusRect.setAttribute("height", 4);
		this.zoomMinus.setAttribute("transform", "translate(12.5, " + (200 + this.radius*2) + " )");
		this.zoomMinus.setAttribute("class", "zoomButton");
		this.zoomMinus.setAttribute("onclick", "flowGraph.clickZoom(1)");
		this.zoomMinus.appendChild(zoomMinusB);
		this.zoomMinus.appendChild(minusRect);
		this.zoomBar.appendChild(this.zoomMinus);
		
		var zoomSlider = document.createElementNS(this.svgns, 'g');
		zoomSlider.setAttribute("transform", "translate(0, " + this.radius +")");
		zoomSlider.setAttribute("class", "zoomSlider");
		zoomSlider.setAttribute("onclick", "flowGraph.sliderClick(evt, this)");
		
		this.zoomLine = document.createElementNS(this.svgns, 'rect');
		this.zoomLine.setAttribute("class", "zoomLine");
		this.zoomLine.setAttribute("x", 8);
		this.zoomLine.setAttribute("y", 0);
		this.zoomLine.setAttribute("height", this.zoomHeight);
		this.zoomLine.setAttribute("width", 8);
		zoomSlider.appendChild(this.zoomLine);
		
		var dottedLine = document.createElementNS(this.svgns, 'line');
		dottedLine.setAttribute("x1", 12.5);
		dottedLine.setAttribute("y1", 0);
		dottedLine.setAttribute("x2", 12.5);
		dottedLine.setAttribute("y2", this.zoomHeight);
		zoomSlider.appendChild(dottedLine);
		
		// Set up the bar that moves
		this.zoomPicker = document.createElementNS(this.svgns, 'rect');
		this.zoomPicker.setAttribute("rx", 5);
		this.zoomPicker.setAttribute("class", "zoomPicker");	
		this.zoomPicker.setAttribute("x", 0);
		this.zoomPicker.setAttribute("y", 0);
		this.zoomPicker.setAttribute("width", 24);
		this.zoomPicker.setAttribute("height", 10);

		this.zoomPicker.setAttribute("onmousedown", "flowGraph.zoomBarManipulate(true)");
		this.zoomPicker.setAttribute("onmouseup", "flowGraph.zoomBarManipulate(false)");
		zoomSlider.appendChild(this.zoomPicker);
		this.zoomBar.appendChild(zoomSlider);
		
		this.zoomBar.setAttribute("transform", "translate(4, 14)");
		this.svgElement.appendChild(this.zoomBar);

		this.clickZoom(0); //for setup only
	},

	resizeSVG: function(item) {
		this.svgElement = document.getElementById("graph");
		alert(item.getHeight() + ","+ item.getWidth())
	},

	moveGraph: function (element, evt, type) {
		if (!evt) var evt = window.event;

		if (this.zoomMode && type == "move") {
			if (!evt) var evt = window.event;
			var deltaY = evt.clientY - mouseY;
			
			this.moveZoomPicker(deltaY + this.saveYPos);
		}
		else if (type == "move") {
	    	if (isMouseDown) {
				var deltaX = evt.clientX - mouseX;
				var deltaY = evt.clientY - mouseY;
				if (moveNode) {
					currentGraph.moveSelectedNodes(deltaX, deltaY);
				}
				else {
					currentGraph.panGraph(deltaX, deltaY);
				}
				mouseX = evt.clientX;
				mouseY = evt.clientY;
			}
		}
		else if (type == "down") {
			moveNode = this.shouldMoveNode();
			isMouseDown = true;
			element.setAttribute('onmousemove',"flowGraph.moveGraph(this, event, 'move')");
			mouseX = evt.clientX;
			mouseY = evt.clientY;
		}
	   else if (type == "up") {
			isMouseDown = false;
			zoomMode = false;
			saveYPos = parseFloat(this.zoomPicker.getAttribute("y"));
			element.setAttribute('onmousemove',null);
		}
	},

	shouldMoveNode: function() {
		if (!this.currentGraph) {
			return false;
		}

		return this.editMode && this.currentGraph.getSelectedNodes() && this.currentGraph.getCursorNode();
	},

	clickZoom: function(zoomFactor) {
		var zoomAmount = 10 * zoomFactor;
		var position = zoomAmount + this.pickerPos;
		this.moveZoomPicker(position);
	}, 

	zoomBarManipulate: function(mode) {
		this.zoomMode = mode;
		this.saveYPos = parseFloat(this.zoomPicker.getAttribute("y"));
	}
};
