/*********************************/
/*             Events            */
/*********************************/
Berry.prototype.events = {initialize:[]};

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
Berry.prototype.on = function(topic, func, context, execute) {
	var eventSplitter = /\s+/;
	if(eventSplitter.test(topic)){
		var list = topic.split(eventSplitter);
		for (var t in list) {
			if(typeof context !== 'undefined'){
				this.addSub(list[t], $.proxy(func, context));
			}else{
				this.addSub(list[t], func);
			}
		}
	}else{
		if(typeof context !== 'undefined'){
			this.lastToken = this.addSub(topic, $.proxy(func, context));
		}else{
			this.lastToken = this.addSub(topic, func);
		}
	}
	if(execute){
		func.call(this, null, topic);
	}
	return this;
};

//add code to handle parameters and cancelation of events for objects/forms that are deleted
Berry.prototype.delay = function(topic, func, execute, delay) {
	var temp = function(args, topic, token){
		clearTimeout(this.events[token].timer);
		this.events[token].timer = setTimeout($.proxy(function(){
			this.events[token].func.call(this);
		}, this) , (delay || 250));
	};

	var eventSplitter = /\s+/;
	if(eventSplitter.test(topic)){
		var list = topic.split(eventSplitter);
		for (var t in list) {
			this.lastToken = this.addSub(list[t], temp);
			this.events[this.lastToken] = {func: func, timer: null};
		}
	}else{
		this.lastToken = this.addSub(topic, temp);
		this.events[this.lastToken] = {func: func, timer: null};
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
/*********************************/
/*         End  Events           */
/*********************************/