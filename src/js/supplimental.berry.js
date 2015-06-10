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

Berry.render = function(name , data) {
	return (templates[name] || templates['berry_text']).render(data, templates);
};
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

Berry.prototype.toArray = function() {
	// var fields = [];
	// for(var i in this.fields){
	// 	fields.push(this.fields[i]);
	// }
	// return fields;
	return this.fields.map(function(key){
		return this.fields;
	});
};

Berry.counter = 0;
Berry.getUID = function() {
	return 'b' + (Berry.counter++);
};
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
$.pluck = function(arr, key) {
	return $.map(arr, function(e) { return e[key]; });
};