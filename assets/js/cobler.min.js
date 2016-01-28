//		CoblerJS 0.1.3
//		(c) 2011-2014 Adam Smallcomb
//		Licensed under the MIT license.
//		For all details and documentation:
//		https://github.com/Cloverstone/Cobler

function cobler(options){
	this.clear = function() {
		this.deselect();
		$('#cb-content').empty();
		this.slices = [];
		this.$el.find('#cb-starter').remove();
		this.$el.find('#cb-content').remove();

		if(this.options.editable){
			this.$el.append(Berry.render('cobler_init', this,options));
			$('#cb-content').sortable({
				cursor: 'move',
				//items: "> li:not(.selected)",
     		items: "li:not(.locked)",
				placeholder: 'cb-placeholder',
				forcePlaceholderSize: true,
				axis: this.options.axis,
				 start: function(event,ui) {
				 	$('.cb-placeholder').attr('data-name',$(ui.item[0]).attr('data-name')).addClass($(ui.item[0]).attr('class'));
				 },
				stop: $.proxy(function(event, ui) {
					this.slices.splice($(ui.item).index(), 0, this.slices.splice(getSliceIndex($(ui.item).attr('id')), 1)[0]);
					cobler.changed = true;
					this.trigger('change');
				}, this),
				cancel: '#cb-content li .cobler-li-content, #cb-content li.locked',
				receive: function(e, ui) {
					copyHelper = null;
				}
			});//.disableSelection();
		}else{
			this.$el.append(Berry.render('cobler_init_noedit',this,options));
		}
	};

	this.reload = function() {
		var temp = this.toJSON();
		this.clear();
		this.load(temp);
	};

	this.load = function(slices) {
		this.clear();
		for(var i in slices) {
			$('#cb-starter').hide();
			var temp = new cobler.types[slices[i].widgetType](this, slices[i]);
			if(temp.validate(slices[i], false)) {
				$(temp.createEL()).appendTo('#cb-content');
				this.slices.push(temp);
			}
			if(temp.callback) {
				temp.callback.call(temp);
			}
		}
	};

	this.toJSON = function(options) {
		var options = $.extend({}, this.options, options);
		if(options.associative) {
			json = {};
			for(var i in this.slices) {
				// json[this.slices[i].uuid] = this.slices[i].attributes;
				json[this.slices[i].uuid] = this.slices[i].toJSON(true);
			}
			return json;
		} else {
			json = [];
			for(var i in this.slices) {
				// json.push(this.slices[i].attributes);
				json.push(this.slices[i].toJSON(true));
			}
			return json;
		}
	};

	this.toHTML = function(json) {
		// if(typeof json === 'undefined') {
		// 	json = this.toJSON();
		// }
		// var tempDiv = $('<div/>');
		// var includes = '';
		// for(var i in json) {
		// 	cobler.types[json[i].type].toHTML(true).appendTo(tempDiv);
		// 	if(cobler.types[json[i].type].include) {
		// 		includes += cobler.types[json[i].type].include(json[i], true);
		// 	}
		// }
		// var html = tempDiv.html() + includes;
		// return html;
		var tempDiv = $('<div/>');
		for(var i in this.slices) {
			//tempDiv.append(this.slices[i].toHTML(true));
			tempDiv.append(this.slices[i].$el.find('.cobler-li-content').html());
			// if(this.slices[i].callback) {
			// 	this.slices[i].callback.call(this.slices[i]);
			// }
		}
		return tempDiv.html();

	};

	this.add = function(name, attributes) {
		var temp = new cobler.types[name](this, attributes);
		if(temp.validate(temp.defaults, false)){
			this.slices.push(temp);
			select(temp.createEL().appendTo('#cb-content').hide().show('highlight'));
			$('#cb-starter').hide();
		}
	};

	this.updateWidget = function(thrower) {
		if(this.selected){
			this.selected.toJSON(false);

			//if(thrower.force == true || this.selected.contentFields !== true) {
			if(thrower.force == true || (typeof thrower.path !== 'undefined' && this.form.find(thrower.path).force == true) || this.selected.contentFields !== true) {
				// /this.form.find(thrower.path).ignore
				if(self.selected.editView && !thrower.force){
					this.selected.$el.find('.cobler-li-content').html(this.selected.editView());
					if(this.selected.contentFields){
						this.form.each(function(){
							$('.'+this.item.fieldset).append(this.$el)
						})
					}
						//this.selected.$el.replaceWith($(this.selected.createEL()).addClass('selected'));
				}else{
						this.selected.$el.replaceWith($(this.selected.createEL()).addClass('selected'));
				}
			}
			if(this.selected.callback) {
				this.selected.callback.call(this.selected);
			}
		}
		cobler.changed = true;
		this.trigger('change');
	};
	
	this.deselect = function() {
		if(self.selected){
			if(this.form) {
				this.updateWidget({force: true});
				this.form.destroy();
				this.form = false;
			}
			self.selected.blur();
			self.selected.$el.removeClass('selected');
			self.selected = false;
			this.trigger('editComplete');
		}
	};

	this.remove = function(id) {
		if(!this.options.confirm || confirm("Are you sure you want to delete this widget?")){
			var slice = getSlice(id) || this.selected;

			if(slice.$el.hasClass('selected')) {
				this.deselect();
			}
			if(slice){
				slice.$el.fadeOut('fast', function() {
					this.remove();
					$('#cb-starter').toggle($('#cb-content > li').length === 0);
				});

				slice.remove();
				this.slices.splice(getSliceIndex(slice.uuid), 1);
			}
		}
	};

	this.duplicate = function(id) {
		var slice = getSlice(id) || this.selected;
		//this.add(slice.attributes.widgetType, $.extend(true, {}, slice.attributes));
		var temp = new cobler.types[slice.attributes.widgetType](this, $.extend(true, {}, slice.attributes));
		if(temp.validate(temp.attributes,false)) {
			this.slices.push(temp);
			select(temp.createEL().insertAfter(slice.$el).hide().show('highlight'));
		}
		if(temp.callback) {
			temp.callback.call(temp);
		}
	};

	this.addTypeDisplay = function(object){
		if(this.options.types === 'all' || ($.inArray(object.category, this.options.types) > -1)){
			$(Berry.render('cobler_widget', object )).appendTo('#cb-source');
		}
	}

	var select = function(el) {
		//if(self.selected) {self.selected.blur(); self.selected.$el.removeClass('selected');}

		if(!$(el).hasClass('selected')) {
			self.deselect();
			self.selected = getSlice($(el).attr('id'));
			self.selected.$el.addClass('selected');
			if(self.options.autoedit) {
				edit(el);
			}
		}
	};

	var edit = function(el) {
		if(self.form){
			self.form.destroy();
			self.form = false;
		}
		if(self.selected.editView){
			self.selected.$el.find('.cobler-li-content').html(self.selected.editView());
		}
				//self.form = $('#cb-form').show().berry(getSlice($(el).attr('id')).toFORM());
		self.form = $('#cb-form').show().berry(getSlice($(el).attr('id')).toFORM());
		self.form.on('change', $.proxy(self.updateWidget, self));

		self.trigger('edit');
	};

	var getSlice = function(id) {
		for(var i in self.slices) {
			if(self.slices[i].uuid == id) {
				return self.slices[i];
			}
		}
		return false;
	};

	var getSliceIndex = function(id) {
		for(var i in self.slices) {
			if(self.slices[i].uuid == id) {
				return i;
			}
		}
		return false;
	};

	this.options = $.extend({name: Berry.getUID(), types: 'all', target: '#content', axis: '', form: '#alt-sidebar', source: '#alt-sidebar', autoedit: true, associative: false, editable: true, confirm: true, activeFormClass: 'active'}, options);
	var self = this;
	this.selected = false;
	this.form = false;

	this.slices = [];
	this.$el = $(this.options.target);
	this.clear();
	$(this.options.form).empty();
	$(this.options.source).empty();

	if($('#cb-source').length === 0) {
		$(this.options.source).append(Berry.render('cobler_controls', options));
		for(var i in cobler.types) {
			this.addTypeDisplay(cobler.types[i].prototype);
		}
	}
	if($('#cb-form').length === 0) {
		$(this.options.form).append(Berry.render('cobler_controls', options));
	}


	$(this.options.target).off('click', '#cb-content li span.remove-item');
	$(this.options.target).on('click', '#cb-content li span.remove-item', $.proxy(function(e) {
		e.stopPropagation();
		this.remove($(e.target).parents('li').attr('id'));
	}, this));

	$('body').off('click', '#removeactive');
	$(this.options.source).on('click', '#removeactive', $.proxy(function(e) {
		e.stopPropagation();
		if(this.selected){
			this.remove(this.selected.uuid);
		}
	}, this));

	$(this.options.target).off('click', '#cb-content li span.duplicate-item');
	$(this.options.target).on('click', '#cb-content li span.duplicate-item', $.proxy(function(e) {
		e.stopPropagation();
		this.duplicate($(e.target).parents('li').attr('id'));
	}, this));

	$(this.options.target).off('click', '#cb-content > li');
	$(this.options.source).off('click', '#cb-source > li');

	if(this.options.editable){
		$(this.options.target).on('click', '#cb-content > li', function() {
			select(this);
		});

		$(this.options.source).on('click', '#cb-source > li', $.proxy(function(e) {
			e.stopPropagation();
			this.add($(e.target).closest('li').data('name'));
			cobler.changed = true;
			this.trigger('change');
		}, this));
	}

	var copyHelper = null;
	$('#cb-source').sortable({
		connectWith: '#cb-content',
		forcePlaceholderSize: true,
		helper: function(e, li) {
			li.clone().addClass('inUse').css({height:li.outerHeight(),width:li.outerWidth()}).insertAfter(li);
			return li;
		},
		placeholder: 'cb-placeholder source',
		stop: $.proxy(function(event,ui) {
			if($(ui.item).parent().attr('id') == 'cb-source') {
				$(event.target).sortable('cancel');
					$('.inUse').remove();
			} else {
				var temp = new cobler.types[$(ui.item).data('name')](this);
				if(temp.validate(temp.attributes, false)) {
				//if(this.add($(ui.item).data('name')))
					this.slices.splice($(ui.item).index(), 0, temp);
					cobler.changed = true;
					this.trigger('change');
					$('.inUse').removeClass('inUse');
					var domobj = $(temp.createEL());
					$(ui.item).replaceWith(domobj);
					select(domobj.hide().show('highlight'));
					$('#cb-starter').hide();
				} else {
					$(event.target).sortable('cancel');
					$('.inUse').remove();
				}
			}
		}, this)
	});//.disableSelection();


	// window.onbeforeunload = function() {
	// 	if(cobler.changed){
	// 		return 'Any changes that you made will be lost.';
	// 	}
	// };

	$(this.options.source).on('click', '#showwidgets', $.proxy(function(event){
		this.deselect();
	}, this));

	this.on('editComplete', function(){
		$('#showwidgets, #alt-sidebar .panel-heading').hide();
		$('#cb-source').show();
	});
	this.on('edit', function() {
		$('#showwidgets, #alt-sidebar .panel-heading').show();
		$('#cb-source').hide();
	});

	cobler.instances[this.options.name] = this;
}


cobler.register = function(object) {
	cobler.types[object.type] = cobler.slice.extend(object);
	if($('#cb-source').length > 0) {
		//$(Berry.render('cobler_widget_cobler', object)).appendTo('#cb-source');
		for(var i in cobler.instances){
			cobler.instances[i].addTypeDisplay(object);
		}
			//$(Berry.render('cobler_widget_cobler', cobler.types[i].prototype )).appendTo('#cb-source');
	}
};

cobler.types = {};

cobler.slice = function(owner, initial) {
	this.owner = owner;
	this.attributes = {};
	$.extend(true, this.attributes, this.defaults, initial, {widgetType: this.type});
	this.uuid = Berry.getUID();
};

$.extend(cobler.slice.prototype, {
	createEL: function() {
		if(cb.options.editable) {
			this.$el = $(Berry.render('cobler_element', this));
		}else{
			this.$el = $(Berry.render('cobler_element_noedit', this));
		}
		this.$el.find('.cobler-li-content').append(this.toHTML());
		return this.$el;
	},
	validate: function() {return true;},
	remove: function() {},
	blur: function() {},
	fields: [],
	toFORM: function() {
		return {label: this.display, inline: true, renderer: 'tabs', tabsTarget: $('#alt-sidebar .panel-heading'), actions: false, attributes: this.attributes, items:[], fields: this.fields};
	},
	toJSON: function(publishing) {
		if(!publishing){
			this.attributes = $.extend(this.attributes, this.owner.form.toJSON());
		}
		return this.attributes;
	},
	toHTML: function(publishing) {
		if(typeof this.template !== 'undefined') {
			if(typeof this.template === 'string') {
				return Berry.render(this.template, $.extend({},this.filter,this.attributes));
			} else {
				return Berry.render(this.template(), $.extend({},this.filter,this.attributes));
			}
		}
		return $('<div/>');
	}
});
cobler.instances = {};
cobler.slice.extend = Berry.field.extend;
cobler.prototype.events = {initialize: []};
cobler.prototype.addSub = Berry.prototype.addSub;
cobler.prototype.on = Berry.prototype.on;
cobler.prototype.off = Berry.prototype.off;
cobler.prototype.trigger = Berry.prototype.trigger;

cobler.changed = false;

$('body').keydown(function(event) {
	switch(event.keyCode) {
		case 27://escape
				cb.deselect();
			break;
	}
});

function containsKey( list , keys ){
	var returnArray = {};
	for (var key in keys) {
		if(typeof list[keys[key]] !== 'undefined'){
			returnArray[keys[key]] = list[keys[key]];
		}
	}
	return returnArray;
}