Berry.prototype.events = {initialize:[]};
	//pub/sub service
Berry.prototype.addSub = function(topic, func){
	if (!this.events[topic]) {
		this.events[topic] = [];
	}
	var token = Berry.getUID();
	this.events[topic].push({
		token: token,
		func: func
	});
	return token;
};
Berry.prototype.on = function(topic, func, execute) {
	var eventSplitter = /\s+/;
	if(eventSplitter.test(topic)){
		var list = topic.split(eventSplitter);
		for (var t in list) {
			this.addSub(list[t], func);
		}
	}else{
		this.lastToken = this.addSub(topic, func);
	}
	if(execute){
		func.call(this, null, topic);
	}
	return this;
};

//add code to handle parameters and cancelation of events for objects/forms that are deleted
Berry.prototype.delay = function(topic, func, execute, delay) {
	funcname = Berry.getUID();
	this.events[funcname] = {func: func, timer: null};

	var temp = function(){
		clearTimeout(this.events[funcname].timer);
		this.events[funcname].timer = setTimeout($.proxy(function(){
			this.events[funcname].func.call(this);
		},this) , 250);
	};

	var eventSplitter = /\s+/;
	if(eventSplitter.test(topic)){
		var list = topic.split(eventSplitter);
		for (var t in list) {
			this.addSub(list[t], temp);
		}
	}else{
		this.lastToken = this.addSub(topic, temp);
	}
	if(execute){
		func.call(this, null, topic);
	}
	return this;

};
Berry.prototype.off = function(token) {
	for (var m in this.events) {
		if (this.events[m]) {
			for (var i = 0, j = this.events[m].length; i < j; i++) {
				if (this.events[m][i].token === token) {
					this.events[m].splice(i, 1);
					return token;
				}
			}
		}
	}
	return this;
};
Berry.prototype.processTopic = function(topic, args){
	if (this.events[topic]) {
		var t = this.events[topic],
			len = t ? t.length : 0;
		while (len--) {
			t[len].func.call(this, args, topic, t[len].token);
		}
	}
}
Berry.prototype.trigger = function(topic, args) {
	if (this.events[topic]) {
		var t = this.events[topic],
			len = t ? t.length : 0;
		while (len--) {
			t[len].func.call(this, args, topic, t[len].token);
		}
	}
	//this.processTopic(topic, args);
	newtopic = topic.split(':')[0];	
	if(newtopic !== topic){
		topic = newtopic;
		if (this.events[topic]) {
			var t = this.events[topic],
				len = t ? t.length : 0;
			while (len--) {
				t[len].func.call(this, args, topic, t[len].token);
			}
		}
	}

	return this;
};