Berries = Berry.instances = {};
Berry.counter = 0;
Berry.types = {};
Berry.collections = {};
Berry.options = {
	errorClass: 'has-error',
	errorTextClass: 'font-xs.text-danger',
	inline: false,
	modifiers: '',
	renderer: 'base',
	flatten: true,
	columns: 12,
	autoDestroy: true,
	autoFocus: true,
	actions: ['cancel', 'save']
};

Berry.register = function(elem) {
	if(elem.extends && typeof Berry.types[elem.extends] !== 'undefined'){
		Berry.types[elem.type] = Berry.types[elem.extends].extend(elem);
	}else{
		Berry.types[elem.type] = Berry.field.extend(elem);
	}
}

/**
 * 
 *
 * @param {array} o The array of fields to be searched
 * @param {string} s The path 
 * @internal
 */
Berry.search = function(o, s) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		var a = s.split('.');
		while (a.length) {
			var n = a.shift();
			if (typeof o !== 'undefined' && o !== null && n in o) {
				o = o[n];
			} 
		}
		return o;
	}

Berry.processOpts = function(item, object) {
 
	// If max is set on the item, assume a number set is desired. 
	// min defaults to 0 and the step defaults to 1.

	if(typeof item.max !== 'undefined') {
		item.min = (item.min || 0);
		item.choices = (item.choices || []);
		if(item.step != 0){
			if(item.min <= item.max) {
				for (var i = item.min; i <= item.max; i=i+(item.step || 1) ) { 
					item.choices.push(i.toString());
				}
			}
		}

	}

	// If a function is defined for choices use that.
	if(typeof item.choices === 'function') {
		item.options = item.choices.call(this, item);
	}

	if(typeof item.choices !== 'undefined' && item.choices.length > 0) {
		if(typeof item.choices === 'string') {
			if(typeof Berry.collections[item.choices] === 'undefined') {
				var getAttributes = function(object){
					$.ajax({
						url: item.choices,
						type: 'get',
						success: function(data) {
							Berry.collections[item.choices] = data;
							object.update({choices: data, value: Berry.search(object.owner.options.attributes, object.getPath())});
						}
					});
				}
				getAttributes(object);

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

		// Insert the default value at the beginning 
		if(typeof item.default !== 'undefined') {
			item.choices.unshift(item.default);
		}

		item.options = $.map(item.choices, function(value, index) {
			return [value];
		});
	}else{
				// Insert the default value at the beginning 
		if(typeof item.default !== 'undefined') {
			item.options.unshift(item.default);
		}
	}

	if(typeof item.options !== 'undefined' && item.options.length > 0) {
		var set = false;
		for ( var o in item.options ) {
			var cOpt = item.options[o];

			if(typeof cOpt === 'string' || typeof cOpt === 'number') {
				cOpt = {label: cOpt};
				if(item.value_key !== 'index'){
					cOpt.value = cOpt.label;
				}
			}

			if(typeof item.value_key !== 'undefined' && item.value_key !== ''){
				if(item.value_key === 'index'){
					cOpt.value = o;
				}else{
					cOpt.value = cOpt[item.value_key];
				}
			}
			if(typeof cOpt.value === 'undefined'){
				cOpt.value = cOpt.id;
			}

			if(typeof item.label_key !== 'undefined' && item.label_key !== ''){
				cOpt.label = cOpt[item.label_key];
			}
			
			if(typeof cOpt.label === 'undefined'){
				cOpt.label = cOpt.label || cOpt.name || cOpt.title;
			}


			item.options[o] = cOpt;//$.extend({label: cOpt.name, value: o}, {label: cOpt[(item.label_key || 'title')], value: cOpt[(item.value_key || 'id')]}, cOpt);

			//if(!set) {
				if(typeof item.value !== 'undefined' && item.value !== '') {
					if(!$.isArray(item.value)) {
						item.options[o].selected = (cOpt.value == item.value);
					} else {
						item.options[o].selected = ($.inArray(cOpt.value, item.value) > -1);
					}
				}
				// else {
				// 	item.options[o].selected = true;
				// 	item.value = item.options[o].value;
				// }
				// set = item.options[o].selected;
			// } else {
			// 	item.options[o].selected = false;
			// }
		}
	}
	return item;
}

Berry.getUID = function() {
	return 'b' + (Berry.counter++);
};

Berry.render = function(name , data) {
	return (templates[name] || templates['berry_text']).render(data, templates);
};

Berry.register({
	type: 'fieldset',
	getValue: function() { return null;},
	create: function() {
		this.name = this.name || Berry.getUID();
		if(typeof this.multiple !== 'undefined'){
			this.multiple.min = this.multiple.min || 1;
			if(typeof this.multiple.max !== 'undefined'){
				if(this.multiple.max > this.multiple.min){
					this.multiple.duplicate = true;
				}else if(this.multiple.min > this.multiple.max){
					this.multiple.min = this.multiple.max;
				}
			}//else{this.multiple.duplicate = true;}
		}
		if(!this.isChild()){
			++this.owner.section_count;
			this.owner.sections.push(this);
			this.owner.sectionList.push({'index': this.owner.section_count, 'text': this.item.legend || this.item.label, state: 'disabled', completed: false, active: false, error: false});
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
			return this.owner.processfields(this.fields, this.self, this);
		}
	},
	isContainer: true
});

Berry.renderers = {
	base: function(owner) {
		this.owner = owner;
		this.initialize = function() {
			$(this.owner.$el).keydown($.proxy(function(event) {
				switch(event.keyCode) {
					case 27://escape
						$('#close').click();
						break;
					case 13://enter
						if (event.ctrlKey) {
							this.owner.$el.find('[data-id=berry-submit]').click();
						}
						break;
				}
			}, this));
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

Berry.btn = {
	save: {
		label: 'Save',
		icon:'check',
		id: 'berry-submit',
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
		id: 'berry-close',
		modifier:'default pull-left',
		click: function() {
			if(this.options.autoDestroy) {this.destroy();}
			this.trigger('cancel');
		}
	}
};

Berry.prototype.events.save = [{
	token: Berry.getUID(),
	func: function() {
		if(typeof this.options.action === 'string') {
		if(this.validate()){
			this.trigger('saveing');
			$.ajax({
				url: this.options.action, 
				data: this.toJSON(),
				method: this.options.method || 'POST',
				success: $.proxy(function(data){this.trigger('saved', data)}, this)
			});
			}
		}
	}
}];

function containsKey(l,k){var r={};for(var j in k){if(typeof l[k[j]]!=='undefined'){r[k[j]]=l[k[j]];}}return r;}
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

$((function($){
	$.fn.berry = function(options) {
		return new Berry(options, this);
	}
})(jQuery));

$.pluck = function(arr, key) {
	return $.map(arr, function(e) { return e[key]; });
};