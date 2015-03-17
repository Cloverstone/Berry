Berry.field = function(item, owner) {
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
		} else if(typeof this.item.value === 'string' && this.item.value.indexOf('=') === 0 && typeof math !== 'undefined') {
			//this.template =  Hogan.compile(this.item.value.substr(1),{delimiters: '{ }'});
			this.liveValue = function() {
				try {
					//var temp = math.eval(this.template.render(this.owner.toJSON(), templates))
					var temp = math.eval(this.item.value.substr(1), this.owner.toJSON());
					if($.isNumeric(temp)){
						return temp.toFixed((this.item.precision || 0));
					}
					return temp;
				}catch(e){
					return this.template.render();
				}
			};
			item.value = this.item.value = this.liveValue();
			this.owner.on('change', $.proxy(function() {
				this.set(this.liveValue());
			}, this));

			// this.getValue = function() { return this.value; }
			// this.set = function(value) {}
			// this.setValue = function(value) {}
			// this.set(this.value);
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
	if(this.item.fieldset !== undefined && $('.' + this.item.fieldset).length > 0) {
		//this.owner.fieldsets.push(this.item.fieldset);
		this.fieldset = $('.' + this.item.fieldset)[0];
		this.owner.fieldsets.push(this.fieldset);
	}else{
		if(this.item.fieldset !== undefined && $('[name=' + this.item.fieldset + ']').length > 0) {
//				this.owner.fieldsets.push(this.item.fieldset);
			this.fieldset = $('[name=' + this.item.fieldset + ']')[0];
			this.owner.fieldsets.push(this.fieldset);
		}
	}
	// if(this.fieldset === undefined && typeof this.item.target === 'object'){
	// 	this.fieldset = this.item.target;
	// }
	this.val = function(value) {
		if(typeof value !== 'undefined') {
			this.set(value);
		}
		return this.getValue();
	};
	this.columns = (this.columns || this.owner.options.columns);
	if(this.columns > this.owner.options.columns) { this.columns = this.owner.options.columns; }
};

$.extend(Berry.field.prototype, {
	type: 'text',
	offset: 0,
	version: '1.0',
	isContainer: false,
	instance_id: null,
	path:'',
	defaults: {},
	parent: null,
	enabled: true,
	// parse: function(){
	// 	return true;
	// },
	// enabled: function(){
	// 	return true;
	// },
	// show: function(){
	// 	return true;
	// }
	getPath: function(force) {
		var path = '';
		if(this.parent !== null && this.parent !== undefined) {
			path = this.parent.getPath(force) + '.';
			if(this.parent.multiple || force){
				path += this.parent.instance_id + '.';
			}
		}
		return path + this.name;
	},
	// getSearchPath: function(){
	// 	return getPath(true);
	// 	// var path = '';
	// 	// if(this.parent !== null && this.parent !== undefined) {
	// 	// 	path = this.parent.getSearchPath() + '.';
	// 	// 	path += this.parent.instance_id + '.';
	// 	// }
	// 	// return path + this.name;
	// },
	isActive: function() {
		return this.parent === null || this.parent.enabled !== false;
	},
	isChild: function(){
		return  this.parent !== null;
	},
	set: function(value){
		if(this.value != value) {
			//this.value = value;
			this.setValue(value);
			this.trigger('change');
		}
	},
	revert: function(){
		//this.value = this.lastSaved;
		this.item.value = this.lastSaved;
		this.setValue(this.lastSaved);
	},
	hasChildren: function() {return !$.isEmptyObject(this.children);},
	create: function() {return Berry.render('berry_' + (this.elType || this.type), this);},
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
		this.$el.on('input', $.proxy(function() {
			this.trigger('change');
		}, this));

		if(this.item.mask && $.fn.mask) {
			this.$el.mask(this.item.mask);
		}
	},
	createAttributes: function() {
		var o = this.owner.attributes;

		if(this.isContainer) {
			if(this.multiple) {
				if(this.isChild()) {
					o = Berry.search(o, this.parent.getPath());
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

			if(typeof this.showConditions === 'boolean') {
				this.self.toggle(this.showConditions);
			}
		}
		if(typeof this.enabled !== 'undefined') {
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
	on: function(topic, func) {
		this.owner.on(topic + ':' + this.name, func);
	},
	delay: function(topic, func) {
		this.owner.delay(topic + ':' + this.name, func);
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
	update: function(item, silent) {
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
				return Berry.render(this.item.template, this);
			} else {
				return this.displayAs() || this.item.default || 'Empty';
			}
		}else{
			if(this.item.template !== undefined) {
				return Berry.render(this.item.template, this);
			} else {
				return this.lastSaved || this.item.default ||  'Empty';
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

Berry.processOpts = function(item) {
	// var options;
	/* 
	If max is set on the item, assume a number set is desired. 
	min defaults to 0 and the step defaults to 1.
	*/
	if(typeof item.max !== 'undefined') {
		item.min = (item.min || 0);
		item.choices = (item.choices || []);
		if(item.min <= item.max) {
			for (var i = item.min; i <= item.max; i=i+(item.step || 1) ) { 
				item.choices.push(i.toString());
			}
		}
	}
	/*
	If a function is defined for choices use that.
	*/
	if(typeof item.choices === 'function') {
		item.choices = item.choices.call(item);
	}

	if(typeof item.choices !== 'undefined' && item.choices.length > 0) {
		if(typeof item.choices === 'string') {
			if(typeof Berry.collections[item.choices] === 'undefined') {
				$.ajax({
					url: item.choices,
					type: 'get',
					success: $.proxy(function(data) {
						Berry.collections[item.choices] = data;
						this.update({choices: data, value: Berry.search(this.owner.attributes, this.getPath())});
					}, item)
				});
				item.options = [];
				return item;
			} else {
				item.choices = Berry.collections[item.choices];
			}
		}

		if(typeof item.choices === 'object' && !$.isArray(item.choices)) {
			// item.choices = item.choices.toJSON();

			for(var c in conditions) {
				Berry.conditions[c].call(this, this.owner, conditions[c], function(bool, token) {
					// conditions[c].callBack
				});
			}
		}

		/* Insert the default value at the begining */
		if(typeof item.default !== 'undefined') {
			item.choices.unshift(item.default);
		}

		item.options = $.map(item.choices, function(value, index) {
			return [value];
		});
	}

	if(typeof item.options !== 'undefined' && item.options.length > 0) {
		var set = false;
		for ( var o in item.options ) {
			var cOpt = item.options[o];
			if(typeof cOpt === 'string' || typeof cOpt === 'number') {
				cOpt = {label: cOpt};
				if(item.key !== 'index'){
					cOpt.value = cOpt.label;
				}
			}
			item.options[o] = $.extend({label: cOpt.name, value: o}, {label: cOpt[(item.key || 'title')], value: cOpt[(item.reference || 'id')]}, cOpt);

			if(!set) {
				if(typeof item.value !== 'undefined' && item.value !== '') {
					item.options[o].selected = (item.options[o].value == item.value);
				} else {
					item.options[o].selected = true;
					item.value = item.options[o].value;
				}
				set = item.options[o].selected;
			} else {
				item.options[o].selected = false;
			}
			//item.options[o].selected = (item.options[o].value == item.value)

		}
	}
	return item;
};
