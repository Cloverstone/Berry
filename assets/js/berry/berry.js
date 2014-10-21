//		BerryJS 0.9.0.9
//		(c) 2011-2014 Adam Smallcomb
//		Licensed under the MIT license.
//		For all details and documentation:
//		https://github.com/Cloverstone/Berry

Berry = function(options, obj) {
	this.list = function(path){
		var fields = this.fields;
		if(typeof path !== 'undefined'){
			fields = this.find(path);
		}
		temp = [];
		this.each(function(list){
			console.log(this.getPath());
			list.push(this.getPath());
		}, temp, fields);
		return temp;
	};

	this.destroy = function() {
		this.each(function() {if(typeof this.destroy === 'function') {this.destroy();}});
		this.trigger('destroy');
		this.$el.empty();
		for(var i in this.fieldsets) {
			//$('[name=' + this.fieldsets[i] + ']').empty();
			$(this.fieldsets[i]).empty();
		}
		this.fields = {};
		if(typeof this.renderer.destroy === 'function') {
			this.renderer.destroy();
		}
		delete	Berry.instances[this.options.name];
		this.trigger('destroyed');
	};

	this.search = function(o, s) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, '');           // strip a leading dot
		var a = s.split('.');
		while (a.length) {
			var n = a.shift();
			if (n in o) {
				o = o[n];
			} else {
				return o;
			}
		}
		return o;
	};

	this.toJSON = function(s, validate) {
		if(validate){this.validate()};
		if(typeof s === 'string'){
			return this.search(this.attributes, s);
		} else {
			parsefields();
			this.working = $.extend(true, {}, this.attributes);
			this.working = processMultiples(this.working);
			if(this.options.flatten && true) {
				this.deflated = [];
				this.each(function() {
					if(this.isContainer && this.owner.options.flatten && (this.instance_id === null || this.instance_id === 0 )){
						if( this.isChild() ){
						var arr = this.parent.getPath().split('.');
						var baz = [];
						for (var i = arr.length - 1; i >= 0; i--) {
							var key = arr[i];
							if (-1 === arr.indexOf(key)) {
								baz.push(key);
							}
						}
						arr = baz;
						var name = arr.pop();
						var temp = arr.join('.');
						if(arr.length ) {
							this.owner.search(this.owner.working, temp)[name] = this.owner.deflate(this.owner.search(this.owner.working, this.getPath()));
						} else {
							if(name) {
								this.owner.working[name] = this.owner.deflate(this.owner.search(this.owner.working, this.getPath()));
							}else{
								$.extend(this.owner.working, this.owner.deflate(this.owner.search(this.owner.working, this.name)));
								delete this.owner.working[this.name];
							}
						}
						this.owner.deflated.push(this.name);
						}else{
							this.owner.deflated.push(this.name);
							$.extend(this.owner.working, this.owner.deflate(this.owner.working[this.name]));
							delete this.owner.working[this.name];
						}
					}
				});
				this.working = this.deflate(this.working);
			}
			return this.working;
		}
	};

	this.deflate = function(o) {
		var j;
		var n = {};
		for(var i in o) {
			if(typeof o[i] === 'object') {
				if($.isArray(o[i])) {
					n[i] = [];
					for(j in o[i]) {
						n[i].push(o[i][j]);
					}
				} else {
					n[i] = {};
					for(j in o[i]) {
						n[i][j] = o[i][j];
					}
				}
			} else {
				n[i] = o[i];
			}
		}
		return n;
	};
	this.populate = function(fields) {
		fields = fields || this.fields;
		this.each(function() {
			if(this.multiple) {
				var temp = {};
					temp = this.owner.toJSON(this.getPath());
				if(temp) {
					var skip = true;
					for(var i in temp) {
						if(!skip) {
							this.owner.processField($.extend({}, this.item, {id: Berry.getUID(), name: this.name}), $(this.self), this.parent, 'after');
						} else { skip = false; }
					}
				}
			}
		}, fields);

		self.each(function() {
			if(!this.isContainer) {
				var temp = this.owner.toJSON(this.getPath());
				this.setValue(temp || '');
				this.trigger('change');
				this.toJSON();
			}
		}, fields);
	};
	var processMultiples = function(attributes) {
		self.altered = $.extend(true, {}, attributes);
		self.each(function() {
			if(this.multiple && this.toArray){
				var temp = this.owner.toJSON(this.getPath());
				var root = this.owner.attributes;
				if(this.isChild()){
					root = this.owner.search(this.owner.altered, this.parent.getPath());
				}
				root[this.name] = {};
				for(var i in this.children) {
					root[this.name][i] = $.pluck(temp,i);
				}
			}
		});
		return self.altered;
	};
	var processMultiplesIN = function() {
		self.each(function() {
			if(this.multiple && this.toArray) {

				var root = this.owner.attributes[this.name];
				if(this.isChild()){
					root = this.owner.search(this.owner.attributes, this.getSearchPath());
				}
				if(root) {
				//if(this.name in this.owner.source) {
					var temp = $.extend(true,{},root[this.name]);
					root[this.name] = [];
	//					var temp = this.owner.attributes[this.name].pop();
					var	source = this.owner.source;
					if(this.isChild()){
						source = this.owner.search(this.owner.source, this.parent.getPath());
					}else{
					}
					for(var k in source[this.name]) {
						for(var i in source[this.name][k]) {

							var newObj = $.extend({}, temp);
							for(var name in temp) {
								newObj[name] = source[this.name][name][i];
							}
							root[this.name].push(newObj);
						}
						break;
					}
				}
			} else {
				if(typeof this.owner.source[this.name] === 'object'){
					if($.isArray(this.owner.source[this.name])){
						this.owner.attributes[this.name] = $.extend([],this.owner.source[this.name]);
					}else{
						this.owner.attributes[this.name] = $.extend({},this.owner.source[this.name]);
					}
				}else{
					this.owner.attributes[this.name] = this.owner.source[this.name];
				}
			}
		});
		return self.attributes;
	};

	var inflate = function(o, n) {
		for(var i in n) {
			if(typeof n[i] === 'object' && !$.isArray(n[i])) {
				if(i in o) {
					n[i] = inflate(o[i], n[i]);
				} else {
					n[i] = inflate(o, n[i]);
				}
			} else {
				if(i in o) {
					n[i] = o[i];
				}
			}
		}
		return n;
	};

	this.toArray = function() {
		var fields = [];
		for(var i in this.fields){
			fields.push(this.fields[i]);
		}
		return fields;
	};

	this.each = function(toCall, args, fields) {
		fields = (fields || this.fields);
		var c = true;
		for(var i in fields) {
			if(c !== false){
				var field = fields[i];
				if(field.item) {
					if(field.isActive()) {
						c = toCall.call(field, args);
					}
				} else if(!$.isEmptyObject(field.instances)) {
					c = this.each(toCall, args, field.instances);
				}
				if(!$.isEmptyObject(field.children)) {
					c = this.each(toCall, args, field.children);
				}
			} else { break; }
		}
		if(c) {
			return args;
		} else {
			return c;
		}
	};

	this.find = function(s, f) {
		var o = (f || this.fields);
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		s = s.replace(/^\./, '');           // strip a leading dot
		var a = s.split('.');
		while (a.length) {
			var n = a.shift();
			var temp = this.shallowFind(n, o);
			if (temp) {
				if(!$.isEmptyObject(temp.children)) {
					o = temp.children;
				} else {
					o = (temp.fields || temp);
				}
			} else {
				//add loop to drill down for name;
				// this.each(function(){

				// });

				return false;
			}
		}
		return o;
	};
	this.shallowFind = function(name, fields) {
		fields = (fields || this.fields);
		for(var i in fields) {
			if(i == name) {
				if(typeof fields[i].instances !== 'undefined'){
					if(fields[i].multiple){
						return fields[i].instances;
					}
					else{
						return fields[i].instances[0];
					}
				}
				return fields[i];
			}
			if(!$.isEmptyObject(field.children)) {
				var temp = this.shallowFind(name, field.children);
				if(temp){ return temp;}
			}
		}
		return false;
	};

	this.processfields = function(fields, target, parent) {
		for(var i in fields) {
			if(typeof fields[i] === 'string'){
				fields[i] = { type : fields[i], label : i };
			}
			fields[i] = $.extend({}, self.options.default, fields[i]);
			//if no name given and a name is needed, check for a given id else use the key
			if(typeof fields[i].name === 'undefined' && !fields[i].isContainer){
				if(typeof fields[i].id !== 'undefined') {
					fields[i].name = fields[i].id;
				} else {
					fields[i].name = i.toLowerCase().split(' ').join('_');
				}
			}
			if(typeof fields[i].label === 'undefined' && fields[i].label !== false) {
				fields[i].label = i;
			}
			if(fields[i].required){
				$.extend(fields[i],{validate: {required: true}});
			}
			if(typeof fields[i].validate !== 'undefined'){
				fields[i].required = fields[i].validate.required;
			}
			this.processField(fields[i], target, parent);
		}
	};

	this.processField = function(item, target, parent, insert) {
		field = $.extend({}, self.options.default, item);
		if(target[0] !== undefined){target = target[0];}
		if(field.type in Berry.types) {
			var current = addField(field, parent, target, insert);
			if(current.fieldset === undefined) { current.fieldset = target; }
			if(insert == 'before') {
				$(target).before(current.render());
			} else if(insert == 'after') {
				$(target).after(current.render());
			} else {
				$(current.fieldset).append(current.render());
			}
			current.initialize();
			return current;
		}
		return false;
	};

	var addField = function(item , parent, target, insert) {
		var current = new Berry.types[item.type](item, self);
		current.parent = parent;

		var root = self.fields;
		if(parent !== null && parent !== undefined) {
			root = parent.children;
		}

		var exists = (root[current.name] !== undefined);

		if(current.isContainer) {
			if(!exists) {
				root[current.name] = { isContainer: true , multiple: current.multiple , hasChildren: !$.isEmptyObject(item.fields) , toArray: (current.item.toArray || current.owner.options.flatten), instances:[] };
			}
			var insertAt = root[current.name].instances.length;
			var targetId = $(target).attr('id');
			for(var j in root[current.name].instances){
				if(root[current.name].instances[j].id == targetId){
					insertAt = parseInt(j, 10) + 1;
					break;
				}
			}
			root[current.name].instances.splice(insertAt, 0, current);

			var index = 0;
			for(var k in root[current.name].instances){
				root[current.name].instances[k].instance_id = index++;
			}
		}else{
			if(exists || current.multiple){
				if(root[current.name].isContainer){
					if(!self.options.flatten){
						var temp = [];
						temp.push(root[current.name]);
						temp = root[current.name];
						root[current.name] = {multiple:current.multiple,hasChildren:!$.isEmptyObject(item.fields),instances:[]};
						root[current.name].instances.push(temp);
					}
				}else if(root[current.name] instanceof Berry.field){
					var temp = [];
					temp.push(root[current.name]);
					temp = root[current.name];
					root[current.name] = {instances: []};
					root[current.name].instances.push(temp);
				}
				root[current.name].instances.push(current);
			} else {
				root[current.name] = current;
			}
		}
		return current;
	};

	var parsefields = function() {
		self.each(function() {
			if(!this.isContainer) {
				var temp;
				if(this.isChild() || (this.instance_id !== null)){
					temp = this.owner.search(this.owner.attributes,this.parent.getPath());
				}else{
					temp = this.owner.attributes;
				}
				if($.isArray(temp)){
					temp[this.parent.instance_id][this.name] = this.getValue();
				}else{
					temp[this.name] = this.getValue();
				}
			}
		});
		return self.attributes;
	};

	var latch = function() {
		self.each(function() {
			this.toJSON();
		});
		parsefields();
		return self.attributes;
	};

	var addActions = function(actions) {
		if(actions) {
			if(!self.options.actionTarget) {
				self.options.actionTarget = $('<div class="berry-actions" style="overflow:hidden;padding-bottom:10px"></div>');
				self.target.append(self.options.actionTarget);
			}
			actions = containsKey(Berry.btn, actions);
			for(var action in actions) {
				var temp = $(Berry.render('berry__action',actions[action]));
					if(typeof actions[action].click === 'function'){
						temp.click($.proxy(actions[action].click, self));
					}
				self.options.actionTarget.append(temp);
			}
		}
	};

	var self = this;
	this.$el = obj;
	this.fieldsets = [];
	this.section_count = 0;
	this.sections = [];
	this.sectionList = [];
	this.options = $.extend(true, {
		name: Berry.getUID(),
		errorClass: 'has-error',
		errorTextClass: 'font-xs.text-danger',
		options: {inline: false},
		modifiers: '',
		renderer: 'base',
		flatten: true,
		autoDestroy: false,
		autoFocus: true,
		default: {type: 'text'},
		actions: ['cancel', 'save']
	}, options);
	this.events = $.extend({}, Berry.prototype.events);

	this.changed = false;

	this.fields = {};
	this.source = {};
	this.attributes = {};
	this.trigger('initialize');

	if(typeof this.$el === 'undefined') { obj = $('<div/>'); }
	this.renderer = new Berry.renderers[this.options.renderer](this);
	this.target = this.renderer.render();

	if(this.options.legend && this.options.legendTarget){
		this.options.legendTarget.append(this.options.legend);
	}
	this.processfields(this.options.fields, this.target, null);

	if(typeof this.options.attributes !== 'undefined'){
		this.source = $.extend(true, {}, this.options.attributes);

		if(this.options.flatten){
			this.source = inflate($.extend(true, {}, this.source), $.extend(true, {}, processMultiples(this.attributes))) || {};
		}
		processMultiplesIN();

		this.populate();
	}


	addActions(this.options.actions);
	if(typeof this.renderer.initialize === 'function') {
		this.renderer.initialize();
	}
	if(this.options.autoFocus){
		this.each(function(){
			this.focus();
			return false;
		});
	}

this.each(function(){

	this.trigger('change');
})

	// if(typeof Berry.instances[this.options.name] !== 'undefined') {
	// 	Berry.instances[this.options.name].on('destroyed', $.proxy(function(){
	// 		Berry.instances[this.options.name] = this;
	// 	},this));
	// 	Berry.instances[this.options.name].destroy();
	// }else{
		Berry.instances[this.options.name] = this;

		this.on('dropped', function(info){
			var instances = this.find(info.path);
			var path = '';
			for(var i in instances){
				if(instances[i].id == info.id){
					path = instances[i].getPath();
					instances.splice(i, 1);
					break;
				}
			}
			var o = self.attributes;
			var s = path;
			s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
			s = s.replace(/^\./, '');           // strip a leading dot
			var a = s.split('.');
			while (a.length) {
				var n = a.shift();
				if (n in o) {
					o = o[n];
				}
			}
			if($.isArray(o)){
				o.splice(i,1);
			}
			else{
				delete o[i];
				var temp = 0;
				for(var j in o){
					if(j >= i){
						o[i++] = o[j];
						delete o[j];
					}
				}
			}
		});
};
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
//	alert(topic);
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

Berries = Berry.instances = {};

Berry.field = function(item, owner){
		this.children = {};
		this.owner = owner;
		this.hidden = false;
		this.item = $.extend(true, {}, this.defaults, item);
		$.extend(this, this.owner.options.options, this.item);
		if(item.value !== 0){
			if(typeof item.value === 'function') {
				this.valueFunc = item.value;
				this.liveValue = function() {
					return this.valueFunc.call(this.owner.toJSON());
				};
				item.value = this.item.value = this.liveValue();
				this.owner.on('change', $.proxy(function(){
					this.set(this.liveValue());
				},this));
			} else {
				this.value = (item.value || this.value || item.default || '');
			}
		} else {
			this.value = 0;
		}
		this.lastSaved = this.liveValue();
		this.id = (item.id || Berry.getUID());//?
		this.self = undefined;
		this.fieldset = undefined;
		if(this.item.fieldset !== undefined && $('.' + this.item.fieldset).length > 0){
			//this.owner.fieldsets.push(this.item.fieldset);
			this.fieldset = $('.' + this.item.fieldset)[0];
			this.owner.fieldsets.push(this.fieldset);
		}else{
			if(this.item.fieldset !== undefined && $('[name=' + this.item.fieldset + ']').length > 0){
//				this.owner.fieldsets.push(this.item.fieldset);
				this.fieldset = $('[name=' + this.item.fieldset + ']')[0];
				this.owner.fieldsets.push(this.fieldset);
			}
		}
		// if(this.fieldset === undefined && typeof this.item.target === 'object'){
		// 	this.fieldset = this.item.target;
		// }
		this.val = function(value){
			if(typeof value !== 'undefined'){
				this.set(value);
			}
			return this.getValue();
		};
};

$.extend(Berry.field.prototype, {
	type: 'text',
	version: '1.0',
	isContainer: false,
	instance_id: null,
	path:'',
	defaults: {},
	parent: null,
	// parse: function(){
	// 	return true;
	// },
	// enabled: function(){
	// 	return true;
	// },
	// show: function(){
	// 	return true;
	// }
	getPath: function(){
		var path = '';
		if(this.parent !== null && this.parent !== undefined) {
			path = this.parent.getPath() + '.';
			if(this.parent.multiple){
				path += this.parent.instance_id + '.';
			}
		}
		return path + this.name;
	},
	getSearchPath: function(){
		var path = '';
		if(this.parent !== null && this.parent !== undefined) {
			path = this.parent.getSearchPath() + '.';
			path += this.parent.instance_id + '.';
		}
		return path + this.name;
	},
	isActive: function(){
		return this.parent === null || this.parent.enabled !== false;
	},
	isChild: function(){
		return  this.parent !== null;
	},
	set: function(value){
		if(this.value !== value){
			this.value = value;
			this.setValue(this.value);
			this.trigger('changed');
		}
	},
	revert: function(){
		this.value = this.lastSaved;
		this.item.value = this.lastSaved;
		this.setValue(this.value);
	},
	hasChildren: function() {return !$.isEmptyObject(this.children);},
	create: function(source) {return Berry.render('berry_' + (this.elType || this.type), this);},
	render: function() {
		if(typeof this.self === 'undefined') {
			this.self = $(this.create()).attr('data-Berry',this.owner.options.name);
		} else {
			this.self.html($(this.create()).html());
		}
		this.display = this.getDisplay();
		return this.self;
	},
	getValue: function() { return this.$el.val(); },
	toJSON: function() {
		this.value = this.getValue();
		this.lastSaved = this.value;
		this.display = this.getDisplay();
		return this.lastSaved;
	},
	liveValue: function() {
		return this.value;
	},
	setup: function() {
		this.$el = this.self.find('input');
		this.$el.off();
		if(this.onchange !== undefined){ this.$el.on('input', this.onchange);}
		this.$el.on('input', $.proxy(function() {this.trigger('change');}, this));

		if(this.item.mask && $.fn.mask){
			this.$el.mask(this.item.mask);
		}
	},
	createAttributes: function(){
		var o = this.owner.attributes;

		if(this.isContainer) {
			if(this.multiple){
				if(this.isChild()) {
					o = this.owner.search(o, this.parent.getPath());
				}
				o[this.name] = (o[this.name] || []);
			}else{
				o[this.name] = {};
			}
		} else {
			var s = this.getPath();
			s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
			s = s.replace(/^\./, '');           // strip a leading dot
			var a = s.split('.');
			while (a.length) {
				var n = a.shift();
				if (n in o) {
					o = o[n];
				}else{
					if(n == this.name) {
						o = o[n] = this.value;
					}else{
						o = o[n] = {};
					}
				}
			}
		}
	},
	initialize: function() {
		if(this.multiple && this.multiple.duplicate){
			this.self.find('.duplicate').click( $.proxy(this.dupeMe, this) );
			this.self.find('.remove').click( $.proxy(this.dropMe, this) );
		}

		this.createAttributes();
		this.setup();
		if(typeof this.show !== 'undefined') {
			this.showConditions = Berry.processConditions.call(this, this.show,
				function(bool, token) {
					this.showConditions[token] = bool;
					this.self.show();
					for(var c in this.showConditions) {
						if(!this.showConditions[c]) {
							this.self.hide();
							break;
						}
					}
				}
			);
		}
		if(this.enabled) {
			this.enabledConditions = Berry.processConditions.call(this, this.enabled,
				function(bool, token) {
					this.enabledConditions[token] = bool;
					this.enabledState = true;
					this.enable();
					for(var c in this.enabledConditions) {
						if(!this.enabledConditions[c]) {
							this.enabledState = false;
							this.disable();
							break;
						}
					}
				}
			);
		}
	},
	on: function(topic, func){
		this.owner.on(topic + ':' + this.name, func);
	},
	trigger: function(topic) {
		this.value = this.getValue();
		this.owner.trigger(topic + ':' + this.name, {
			type: this.type,
			name: this.name,
			id: this.id,
			value: this.value,
			path: this.getPath()
		});
		//this.owner.trigger(topic);
	},
	setValue: function(value) {
		if(typeof this.lastSaved === 'undefined'){
			this.lastSaved = value;
		}
		this.value = value;
		return this.$el.val(value);
	},
	update: function(item,silent) {
		$.extend(this.item, item);
		$.extend(this, this.item);
		this.setValue(this.value);
		this.render();
		this.setup();
		if(!silent) {
			this.trigger('change');
		}
	},
	blur: function() {
		this.$el.blur();
	},
	focus: function() {
		this.$el.focus().val('').val(this.value);
	},
	disable: function() {
		this.$el.prop('disabled', true);
	},
	enable: function() {
		this.$el.prop('disabled', false);
	},
	displayAs: function() {
		return this.lastSaved;
	},
	getDisplay: function() {
		if(this.displayAs !== undefined) {
			if(this.item.template !== undefined) {
				this.display = this.displayAs();
				return Berry.render(this.item.template, this)[0];// ich[this.item.template](this)[0];
			} else {
				return this.displayAs() || 'Empty';
			}
		}else{
			if(this.item.template !== undefined) {
				return Berry.render(this.item.template, this)[0];//ich[this.item.template](this)[0];
			} else {
				return this.lastSaved || 'Empty';
			}
		}
	},
	destroy: function() {
		if(this.$el){
			this.$el.off();
		}
 },
	dupeMe: function() {
		var target = this.self;
		var max = this.max || -1;
		var count = $(target).siblings('[name='+this.name+']').length+1;
		if(max == -1 || max > count){
			var item = $.extend({},this.item,{id:Berry.getUID(),name:this.name});
			this.owner.processField(item, $(target), this.parent, 'after');
			this.owner.each(function(){
				this.createAttributes();
			});

			this.trigger('change');
		}
	},
	dropMe: function() {
		var target = this.self;
		var min = this.min || 1;
		var count = $(target).siblings('[name='+this.name+']').length;
		if(min <= count){
			$(target).empty().remove();
			var index=0;

			this.trigger('dropped');
			var instances = this.owner.find(this.getPath());//.instances;
			for(var j in instances){
				instances[j].instance_id = index++;
			}
			this.trigger('change');
		}
	}
});

Berry.field.extend = function(protoProps) {
	var parent = this;
	var child = function(){ return parent.apply(this, arguments); };
	var Surrogate = function(){ this.constructor = child; };
	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate;
	if (protoProps) $.extend(child.prototype, protoProps);
	return child;
};

Berry.types = {};
Berry.register = function(elem) {
	Berry.types[elem.type] = Berry.field.extend(elem);
};

Berry.register({
	type: 'fieldset',
	getValue: function() { return null;},
	create: function() {
		this.name = this.name || Berry.getUID();
//		this.owner.fieldsets.push(this.name);
		if(!this.isChild()){
			++this.owner.section_count;
			this.owner.sections.push(this);
			this.owner.sectionList.push({'index': this.owner.section_count, 'text': this.item.legend, state: 'disabled', completed: false, active: false, error: false});
		}

		this.owner.fieldsets.push( $('[name="' + this.name + '"]')[0]);
		return this.owner.renderer.fieldset(this);
	},
	focus: function(){
		this.owner.each(function(){
			this.focus();
			return false;
		}, {}, this.children);
		return false;
	},
	setValue: function(value) {return true;},
	setup: function() {
		if(this.fields !== undefined) {
			this.owner.processfields(this.fields, this.self, this);
		}
	},
	isContainer: true
});

Berry.processConditions = function(conditions, func) {
	if (typeof conditions === 'string') {
		if(conditions === 'show' || conditions === 'display') {
			conditions = (this.item.display || this.item.show);
		}else if(conditions === 'enable') {
			conditions = this.item.enable;
		}
	}
	if (typeof conditions === 'bool') {
		return conditions;
	}
	if (typeof conditions === 'object') {
		var keys = [];
		for(var c in conditions){
			keys.push(Berry.conditions[c].call(this, this.owner, conditions[c], func));
		}
		return keys;
	}
	return true;
};

Berry.conditions = {
	requires: function(Berry, args, func) {
		return Berry.on('change:' + args.name, $.proxy(function(args, local, topic, token) {
				func.call(this, (local.value !== null && local.value !== ''), token);
			}, this, args)
		).lastToken;
	},
	// valid_previous: function(Berry, args) {},
	not_matches: function(Berry , args, func) {
		return Berry.on('change:' + args.name, $.proxy(function(args, local, topic, token) {
				func.call(this, (args.value  !== local.value), token);
			}, this, args)
		).lastToken;
	},
	matches: function(Berry, args, func) {
		return Berry.on('change:' + args.name, $.proxy(function(args, local, topic, token) {
				func.call(this, (args.value  === local.value), token);
			}, this, args)
		).lastToken;
	},
	// hasclass: function(Berry,args) {
	// 	if($(args.selector).hasClass(args.match)){
	// 		return true;
	// 	}else{
	// 		return false;
	// 	}
	// }
};

$((function($){
	$.fn.berry = function(options) {
		return new Berry(options, this);
	};
})(jQuery));

Berry.render = function(name , data) {
//	return (ich[name] || ich['berry_text'])(data);
	return (templates.[name] || templates.['berry_text']).render(data);
};
Berry.renderers = {
	base: function(owner) {
		this.owner = owner;
		this.initialize = function() {
			$(this.owner.$el).keydown(function(event) {
				switch(event.keyCode) {
					case 27://escape
						$('#close').click();
						break;
					case 13://enter
						if (event.ctrlKey) {
							$('#submit').click();
						}
						break;
				}
			});
		};
		this.fieldset = function(data) {
			return Berry.render('berry_' + this.owner.options.renderer + '_fieldset',data);
		};
		this.destroy = function() {
			$(this.owner.$el).off();
			this.owner.$el.empty();
		};
		this.render = function() {
			this.owner.$el.html(Berry.render('berry_' + this.owner.options.renderer + '_form' , this.owner.options));
			return this.owner.$el.find('form');
		};
	}
};
Berry.collections = {};

Berry.processOpts = function(item) {
	/*
	If a function is defined for choices use that.
	*/
	if(typeof item.choices === 'function'){
		return item.choices.call(this);
	}
	/* 
	If max is set on the item, assume a number set is desired. 
	min defaults to 0 and the step defualts to 1.
	*/
	if(typeof item.max !== 'undefined'){
		item.min = (item.min || 0);
		item.step = (item.step || 1);
		item.choices = (item.choices || []);
		if(item.min <= item.max) {
			var i = item.min;
			while(i <= item.max){
				item.choices.push(i.toString());
				i += item.step;
			}
		}
	}
	if(typeof item.choices !== 'undefined' && item.choices.length > 0){
		if(typeof item.choices === 'string') {
			if(typeof Berry.collections[item.choices] === 'undefined') {
				$.ajax({
					url: item.choices,
					type: 'get',
					success: $.proxy(function(data) {
						Berry.collections[item.choices] = data;
						this.update({choices: data});
					}, item)
				});
				item.options = [];
				return item;
			} else {
				item.choices = Berry.collections[item.choices];
			}
		}
		if(typeof item.choices === 'object' && !$.isArray(item.choices)){
			item.choices = item.choices.toJSON();
		}
		if(typeof item.default !== 'undefined'){
			item.choices.unshift(item.default);
		}
		item.options = $.map(item.choices, function(value, index) {
			return [value];
		});
	}
	if(typeof item.options !== 'undefined' && item.options.length > 0){
		var set = false;
		for ( var o in item.options   ) {
			var cOpt = item.options[o];
			if(typeof cOpt === 'string' || typeof cOpt === 'number') {
				cOpt = {label: cOpt};
				// if(item.useName) {
				if(item.key !== 'index'){
					cOpt.value = cOpt.label;
				}
			}
			item.options[o] = $.extend({label: cOpt.name, value: o},{label: cOpt[(item.key || 'title')], value: cOpt[(item.reference || 'id')]}, cOpt);

			if(!set){
				if(typeof(item.value) !== 'undefined' && item.value !== ''){
					item.options[o].selected = (item.options[o].value == item.value);
				}else {
					item.options[o].selected = true;
					item.value = item.options[o].value;
				}
				set = item.options[o].selected;
			}else{
				item.options[o].selected = false;
			}
		}
	}
	return item;
};

Berry.btn = {
	save: {
		label: 'Save',
		icon:'check',
		id: 'submit',
		modifier: 'success pull-right',
		click: function() {
			if(this.options.autoDestroy) {
				this.on('saved', this.destroy);
			}
			this.trigger('save');
		}
	},
	cancel: {
		label: 'Cancel',
		icon: 'times',
		id: 'close',
		modifier:'default pull-left',
		click: function() {
			if(this.options.autoDestroy) {this.destroy();}
			this.trigger('cancel');
		}
	}
};

Berry.counter = 0;
Berry.getUID = function() {
	return 'b' + (Berry.counter++);
};

Berry.prototype.sum = function(search) {
	var inputs = this.toJSON(search);
	var val = 0;
	if(typeof inputs === 'object') {
		for(var i in inputs) {
			val += (parseInt(inputs[i] , 10) || 0);
		}
		return val;
	}
	return inputs;
};
$.pluck = function(arr, key) {
	return $.map(arr, function(e) { return e[key]; });
};