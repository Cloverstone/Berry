//		gadgeteerJS 0.1.4
//		(c) 2011-2014 Adam Smallcomb
//		Licensed under the MIT license.
//		For all details and documentation:
//		https://github.com/Cloverstone/widget_factory
function widget_factory(options, obj){
	this.loading = false;

	this.getStructure = function(){		
		if(!this.loading){
			if(this.editor){
				newData = [];
				var self = this;
				var list = this.$el.find('.column').each(function(index){
				column = [];
				$(this).find('.widget').each(function(){
					var temp = _.where(self.widgets, {uuid:$(this).attr('id')});
					// var newTemp = _.clone(temp[0].model.attributes);
					// if(newTemp.loaded){delete newTemp.loaded;}

					// column.push(newTemp);
					var atts = temp[0].model.getAttributes();

					column.push(_.omit(atts, 'loaded'));
				})
				newData.push(column);
				});
				this.data = newData;
				pageData = newData;
				//needed
				// myCanvas.save({content: JSON.stringify(newData)});



				// $.ajax(
				// 	{
				// 		url: '/community_pages/' + pageID, 
				// 		data: {'content': JSON.stringify(newData)},
				// 		method: 'PUT'
				// });
			} else {
				newData = [];
				this.$el.find('.widget').each(function(){

					var temp = _.where(wf.widgets, {uuid:$(this).attr('id')});
					// var temp = _.where(contentManager.currentView.wf.widgets, {uuid:$(this).attr('id')});
					newData.push(_.pick(temp[0].model.attributes,_.union(['guid', 'collapsed'],_.map(temp[0].model.userEdit,function(key){return key.toLowerCase()})) ));
				});



				preferences = newData;
				// $.ajax(
				// 	{
				// 		url: '/page_preference/' + pageID, 
				// 		data: {'content': JSON.stringify(newData)},
				// 		method: 'PUT'
				// });
			}
			this.trigger('change', newData);

			return newData;
		}
	};


	//Cobler - untested
	this.clear = function() {
		this.deselect();
		for(var i in this.widgets){
			this.widgets[i].model.off();
			this.widgets[i].view.remove();
			this.widgets[i].edit.remove();
			delete this.widgets[i];
		}
		// $('#cb-content').empty();

		this.widgets = [];
		// this.$el.find('#cb-starter').remove();
		// this.$el.find('#cb-content').remove();
		if($(".column").hasClass("ui-sortable")){
			$( ".column" ).sortable( "destroy" );
		}
		this.$el.html(this.layouts[(this.layout||0)].template);
		if(this.editor){
			//for(var k = 1; k <= columncount; k++){selector += ', .c'+k;}
			$('.column').sortable({
				connectWith: '.column',
				cursor: 'move',
				items: ".widget:not(.locked)",
				placeholder: 'cb-placeholder',
				forcePlaceholderSize: true,
				axis: this.options.axis,
				stop: $.proxy(function(event, ui) {
					// debugger;
					this.getStructure();
				}, this),
				// cancel: '#cb-content li .cobler-li-content, #cb-content li.locked',
				// receive: function(e, ui) {
				// 	copyHelper = null;
				// }
			});
		}
	};
	this.reload = function(options) {
		// debugger;
		this.editor = true;
		var temp = this.toJSON();
		this.clear();
		this.load(temp, options);
	};
	this.toJSON = function(options) {
		return this.getStructure();
		// var options = $.extend({}, this.options, options);
		// if(options.associative) {
		// 	json = {};
		// 	for(var i in this.widgets) {
		// 		// json[this.slices[i].uuid] = this.slices[i].attributes;
		// 		json[this.widgets[i].uuid] = this.widgets[i].toJSON(true);
		// 	}
		// 	return json;
		// } else {
		// 	json = [];
		// 	for(var i in this.widgets) {
		// 		// json.push(this.slices[i].attributes);
		// 		json.push(this.widgets[i].toJSON(true));
		// 	}
		// 	return json;
		// }


// start here
		// for(var i in this.data ){
		// 	if($('.c'+(columncount+1)).length){
		// 		columncount++;
		// 	}
		// 	for( var j in this.data[i]) {
		// 		if(!this.editor && typeof pagePreferences.content !== 'undefined'){
		// 			//debugger;
		// 			this.add(this.data[i][j].widgetType, $.extend({}, this.data[i][j], _.where(JSON.parse(pagePreferences.content), {guid:this.data[i][j]['guid']})[0]), '.c'+columncount)
		// 		}else{
		// 			this.add(this.data[i][j].widgetType, this.data[i][j], '.c'+columncount)
		// 		}
		// 	}
		// }

	};
	// this.toHTML = function(json) {
	// 	// if(typeof json === 'undefined') {
	// 	// 	json = this.toJSON();
	// 	// }
	// 	// var tempDiv = $('<div/>');
	// 	// var includes = '';
	// 	// for(var i in json) {
	// 	// 	cobler.types[json[i].type].toHTML(true).appendTo(tempDiv);
	// 	// 	if(cobler.types[json[i].type].include) {
	// 	// 		includes += cobler.types[json[i].type].include(json[i], true);
	// 	// 	}
	// 	// }
	// 	// var html = tempDiv.html() + includes;
	// 	// return html;
	// 	var tempDiv = $('<div/>');
	// 	for(var i in this.widgets) {
	// 		//tempDiv.append(this.slices[i].toHTML(true));
	// 		tempDiv.append(this.widgets[i].$el.find('.cobler-li-content').html());
	// 		// if(this.slices[i].callback) {
	// 		// 	this.slices[i].callback.call(this.slices[i]);
	// 		// }
	// 	}
	// 	return tempDiv.html();
	// };
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
			self.selected.$el.blur();
			self.selected.$el.removeClass('selected');
			self.selected = false;
			this.trigger('editComplete');
		}
	};
	this.remove = function(id) {
		if(!this.options.confirm || confirm("Are you sure you want to delete this widget?")){
			var widget = getwidget(id) || this.selected;

			if(widget.$el.hasClass('selected')) {
				this.deselect();
			}
			if(widget){
				widget.$el.fadeOut('fast', function() {
					this.remove();
					$('#cb-starter').toggle($('#cb-content > li').length === 0);
				});
				widget.remove();
				this.widgets.splice(getwidgetIndex(widget.uuid), 1);
			}
		}
	};
	this.duplicate = function(id) {
		var widget = getwidget(id) || this.selected;
		//this.add(slice.attributes.widgetType, $.extend(true, {}, slice.attributes));
		var temp = new widget_factory.types[widget.attributes.widgetType](this, $.extend(true, {}, widget.attributes));
		if(temp.validate(temp.attributes, false)) {
			this.widgets.push(temp);
			select(temp.createEL().insertAfter(widget.$el).hide().show('highlight'));
		}
		if(temp.callback) {
			temp.callback.call(temp);
		}
	};



	this.load = function(data, options){
		this.layout = options.layout || this.layout || 1;
		if(typeof options.editor === 'undefined'){
			this.editor = this.editor || false;
		}else{
			this.editor = options.editor
		}

		$('body').toggleClass('editing', this.editor);

		this.data = data;
		// for(var i in this.widgets){
		// 	this.widgets[i].model.off();
		// 	this.widgets[i].view.remove();
		// 	this.widgets[i].edit.remove();
		// 	delete this.widgets[i];
		// }
		// this.widgets =[];
		// if($(".column").hasClass("ui-sortable")){
		// 	$( ".column" ).sortable( "destroy" );
		// }

		// this.$el.html(this.layouts[(this.layout||0)].template);
		this.clear();
		var columncount = -1;
		this.loading = true;
		for(var i in this.data ){
			if($('.c'+(columncount+1)).length){
				columncount++;
			}
			for( var j in this.data[i]) {
				if(!this.editor && typeof pagePreferences.content !== 'undefined'){
					//debugger;
					this.add(this.data[i][j].widgetType, $.extend({}, this.data[i][j], _.where(JSON.parse(pagePreferences.content), {guid:this.data[i][j]['guid']})[0]), '.c'+columncount)
				}else{
					this.add(this.data[i][j].widgetType, this.data[i][j], '.c'+columncount)
				}
			}
		}

		// //var selector = '.c0';
		// if(this.editor){
		// 	//for(var k = 1; k <= columncount; k++){selector += ', .c'+k;}
		// 	$('.column').sortable({
		// 		connectWith: '.column',
		// 		cursor: 'move',
		// 		items: ".widget:not(.locked)",
		// 		placeholder: 'cb-placeholder',
		// 		forcePlaceholderSize: true,
		// 		axis: this.options.axis,
		// 		stop: $.proxy(function(event, ui) {
		// 			// debugger;
		// 			this.getStructure();
		// 		}, this),
		// 		// cancel: '#cb-content li .cobler-li-content, #cb-content li.locked',
		// 		// receive: function(e, ui) {
		// 		// 	copyHelper = null;
		// 		// }
		// 	});
		// }
		this.loading = false;
	};

	this.add = function(name, attributes, target) {
		var widget = new widget_factory.types[name](this, (attributes || {}));


		if(widget.validate(widget.defaults, false)){
			this.widgets.push(widget);
			widget.container = target;

			var renderTemplate =  (widget.view.container || 'widgets_container');
			if(this.editor){
				renderTemplate = (widget.edit.container || 'widgets_edit_container');
			}
			widget.$el = $(widget_factory.render(renderTemplate, $.extend({title: widget.type , id: widget.uuid},widget.model.attributes)));


			widget.$el.find('.actions .wf-edit').on('click', $.proxy(function(){

					if(this.editor){						
							if(this.modal){
								$().berry({name:'modal', model: this.model, fields: this.model.adminEdit, legend: 'Edit '+this.type}).on('cancel', function(){
									this.options.model.trigger('change');
								}).on('saved',function() {
									// if(!this.options.model.hasChanged()) {
										this.options.model.trigger('publish');
									// }
								});
							}else{
								this.$el.find('.collapsible').berry({name:'modal', model: this.model, fields: this.model.adminEdit, legend: false}).on('cancel', function(){
									this.options.model.trigger('change');
								}).on('saved',function() {
									// if(!this.options.model.hasChanged()) {
										this.options.model.trigger('publish');
									// }
								});
							}
					}else{
						$().berry({name:'modal', model: this.model, fields: this.model.userEdit, legend: 'Edit '+this.type}).on('saved',function() {
									// if(!this.options.model.hasChanged()) {
										this.options.model.trigger('publish');
									// }
								});
					}

					}, widget));



					widget.$el.on('click', '.actions .wf-manage', $.proxy(function(){
						$().berry({name: 'modal', model: this.model, legend: 'Visibility', fields:[
							{label: 'Device', name: 'device', type: 'select', choices: [{label: 'All', value:'widget'}, {label: 'Desktop Only', value:'hidden-xs hidden-sm'},{label: 'Tablet and Desktop', value:'hidden-xs'} ,{label: 'Tablet and Phone', value:'hidden-md hidden-lg'} ,{label: 'Phone Only', value:'visible-xs-block'} ] },
							{label: 'Allow Minimization', name: 'enable_min', type: 'checkbox'},
							{label: 'Limit to Group', name: 'limit', type: 'checkbox'},
							{label: 'Groups', name: 'group', type: 'select', choices: '/groups', key: 'name', reference: 'group_id', 'show': {
								matches: {
									name: 'limit',
									value: true
								}
							}
						}
					]}).on('saved',function(){
						this.options.model.trigger('publish');
					});

				}, widget));
				widget.$el.appendTo(this.$el.find(target));
				if(this.editor){
					widget.$el.prepend(widget.edit.$el);
				}else{
					widget.$el.prepend(widget.view.$el);
				}
			widget.$el.on('click', '.actions .wf-min', $.proxy(function(ui){
				$(ui.currentTarget).parent().parent().find('.panel-heading').css({'border-bottom': 0});
				//var state = !this.model.attributes.colapsed;
				//this.model.set({colapsed: state});
				$(ui.currentTarget).parent().parent().find('.collapsible').toggle(400 , $.proxy(function() {
					this.model.set({collapsed: $(ui.currentTarget).parent().parent().toggleClass('wf-collapsed').hasClass('wf-collapsed') });
					this.model.trigger('publish');
  			},this) );

			}, widget));
			widget.$el.on('click', '.actions .wf-remove', $.proxy(function(ui){
					if (window.confirm("Are you sure you want to remove this widget")) { 
						// $(ui.currentTarget).parent().parent().remove();
						$(ui.currentTarget).closest('.widget').remove();
						this.getStructure();
					}
				}, this));


			if(this.editor){
				widget.edit.render(target);
			}else{
				widget.view.render(target);
			}
			if(!this.loading){widget.$el.find('.actions .wf-edit').click();}
		}

		return this;
	};

	this.addTypeDisplay = function(object) {
		if(this.options.types === 'all' || ($.inArray(object.category, this.options.types) > -1)){
			$(widget_factory.render('widget_factory_widget_widget_factory', object )).appendTo('#cb-source');
		}
	}

	var select = function(el) {
		if(!$(el).hasClass('selected')) {
			//self.deselect();
			self.selected = getwidget($(el).attr('id'));
			//self.selected.view.$el.addClass('selected');
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
		self.form = $('#cb-form').show().berry(getwidget($(el).attr('id')).toFORM());
		self.form.on('change', $.proxy(self.updateWidget, self));

		self.trigger('edit');
	};


	var getwidget = function(id) {
		for(var i in self.widgets) {
			if(self.widgets[i].uuid == id) {
				return self.widgets[i];
			}
		}
		return false;
	};

	var getwidgetIndex = function(id) {
		for(var i in self.widgets) {
			if(self.widgets[i].uuid == id) {
				return i;
			}
		}
		return false;
	};

	// widget_factory.render('widgets__actions');
	// widget_factory.render('widgets__limited_actions');
	// widget_factory.render('widgets__header');
	this.options = $.extend({name: widget_factory.getUID(), types: 'all', target: '#content', axis: '', form: '#alt-sidebar', source: '#alt-sidebar', autoedit: false, associative: false, editable: true, activeFormClass: 'active'}, options);
	
	var self = this;
	this.selected = false;
	//this.form = false;
	this.widgets = [];
	// this.events = $(true, {}, widget_factory.prototype.events);
	this.$el = obj || $(this.options.target);
	//this.clear();





	// $(this.options.target).off('click', '#cb-content li span.remove-item');
	// $(this.options.target).on('click', '#cb-content li span.remove-item', $.proxy(function(e) {
	// 	e.stopPropagation();
	// 	this.remove($(e.target).parents('li').attr('id'));
	// }, this));

	// $('body').off('click', '#removeactive');
	// $(this.options.source).on('click', '#removeactive', $.proxy(function(e) {
	// 	e.stopPropagation();
	// 	if(this.selected){
	// 		this.remove(this.selected.uuid);
	// 	}
	// }, this));

	// $(this.options.target).off('click', '#cb-content li span.duplicate-item');
	// $(this.options.target).on('click', '#cb-content li span.duplicate-item', $.proxy(function(e) {
	// 	e.stopPropagation();
	// 	this.duplicate($(e.target).parents('li').attr('id'));
	// }, this));

	$(this.options.target).off('click', '.widget');
	// $(this.options.source).off('click', '#cb-source > li');

	if(this.options.editable){
		this.$el.on('click', '.widget', $.proxy(function(e) {
			select($(e.currentTarget).closest('.widget'));
		}, this) );

		// $(this.options.source).on('click', '#cb-source > li', $.proxy(function(e) {
		// 	e.stopPropagation();
		// 	this.add($(e.target).closest('li').data('name'));
		// 	cobler.changed = true;
		// 	this.trigger('change');
		// }, this));
	}



	this.events = $.extend(true, {}, widget_factory.prototype.events);

	widget_factory.instances[this.options.name] = this;

}

widget_factory.register = function(object) {
	var extendables = ['view', 'model', 'edit'/*, 'collection'*/];
	for(var ex in extendables){
		if(object[extendables[ex]]) {
			object[extendables[ex]] = widget_factory.widget.prototype[extendables[ex]].extend(object[extendables[ex]]);
		}else{
			// object[extendables[ex]] = widget_factory.widget.prototype[extendables[ex]].extend({});

			object[extendables[ex]] = false;
		}	
	}
	widget_factory.types[object.type] = widget_factory.widget.extend(object);

	if($('#cb-source').length > 0) {
		for(var i in widget_factory.instances){
			widget_factory.instances[i].addTypeDisplay(object);
		}
	}
};

widget_factory.widget = function(owner, initial) {
	this.owner = owner;
	this.attributes = {};
	this.container = '';
	$.extend(true, this.attributes, this.defaults, initial, {widgetType: this.type});

	this.uuid = widget_factory.getUID();
	if(!this.model){
		this.model = new widget_factory.widget.prototype['model'](this.attributes, {widget: this});
	}else{
		this.model = new this.model(this.attributes, {widget: this});
	}
	this.model.off();
	this.model.on('publish', function() {
			this.widget.owner.getStructure();
	})
	this.view = new this.view({model: this.model, attributes: {widget: this}})

	if(!this.edit){
		this.edit = this.view;
	}else{
		this.edit = new this.edit({model: this.model, attributes: {widget: this}})
	}
};


$.extend(widget_factory.widget.prototype, {
	validate: function() {return true;},
	remove: function() {},
	toFORM: function() {
		return {label: this.display, options: {inline: false}, renderer: 'tabs', actions: false, attributes: this.attributes, items:[], fields: this.fields};
	},
	view: Backbone.View.extend({
		template: 'widgets_content',
		initialize: function() {
			this.autoElement();
		}
	}),
	model: Backbone.Model.extend({
		getAttributes: function(){
			return this.attributes;
		},
		schema: {
			Title: {required: true}
		},		
		initialize: function(attributes, options) {
			this.widget = options.widget;
			this.preventSave = false;
		}
	}),
	edit: Backbone.View.extend({
		template: 'widgets_content',
		initialize: function() {
			this.autoElement();
		}
	})
});


widget_factory.types = {};
widget_factory.instances = {};
widget_factory.widget.extend = Backbone.View.extend;
widget_factory.prototype.events = {initialize: []};
widget_factory.prototype.addSub = Berry.prototype.addSub;
widget_factory.prototype.on = Berry.prototype.on;
widget_factory.prototype.off = Berry.prototype.off;
widget_factory.prototype.trigger = Berry.prototype.trigger;

widget_factory.render = function(name , data) {
//	return render(name, data);
	return Berry.render(name, data)
};
widget_factory.counter = 0;
widget_factory.getUID = function() {
//	return 'w' + (widget_factory.counter++);
	return generateUUID();
};

function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

widget_factory.changed = false;
window.onbeforeunload = function() {
	if(widget_factory.changed){
		return 'Any changes that you made will be lost.';
	}
};
$((function($){
	$.fn.widgetFactory = function(options) {
		return new widget_factory(options, this);
	};
})(jQuery));



$('body').keydown(function(event) {
	switch(event.keyCode) {
		case 27://escape
		for(var i in widget_factory.instances){
			widget_factory.instances[i].deselect();
		}
		break;
	}
});


// widget_factory.prototype.layouts = [
// 	{
// 		value: '0',
// 		name: 'Wide Middle 3|6|3',
// 		template: '<div class="col-md-3 c0 column"></div><div class="col-md-6 c1 column"></div><div class="col-md-3 c2 column"></div>'
// 	},
// 	{
// 		value: '1',
// 		name: 'Wide Left 6|3|3',
// 		template: '<div class="col-md-6 c0 column"></div><div class="col-md-3 c1 column"></div><div class="col-md-3 c2 column"></div>'
// 	},
// 	{
// 		value: '2',
// 		name: 'Even 4|4|4',
// 		template: '<div class="col-md-4 c0 column"></div><div class="col-md-4 c1 column"></div><div class="col-md-4 c2 column"></div>'
// 	},
// 	{
// 		value: '3',
// 		name: 'Split 6|6',
// 		template: '<div class="col-md-6 c0 column"></div><div class="col-md-6 c1 column"></div>'
// 	},
// 	{
// 		value: '4',
// 		name: 'Full 12',
// 		template: '<div class="col-md-12 c0 column"></div>'
// 	},
// 	{
// 		value: '5',
// 		name: 'Odd Split',
// 		template: '<div class="col-md-4 c0 column"></div><div class="col-md-8"><div class="row"><div class="col-md-12 c1 column"></div></div><div class="row"><div class="col-md-6 c2 column"></div><div class="col-md-6 c3 column"></div></div></div>'
// 	},
// 	{
// 		value: '6',
// 		name: 'Double Down 1/2/1',
// 		template: '<div class="col-md-12"><div class="row"><div class="col-md-12 c0 column"></div></div><div class="row"> <div class="col-md-6 c1 column"></div><div class="col-md-6 c2 column"></div></div><div class="row"><div class="col-md-12 c3 column"></div></div></div>'
// 	},
// 		{
// 			value: '7',
// 			classes: 'bu-3-6-3',
// 			label: '<i title="Middle Only" class="bu-3-6-3"></i>',
// 			template: '<div class="col-lg-offset-3 col-md-offset-2  col-lg-6 col-md-8 col-sm-12 c0 column"></div></div>'
// 		},
// 	{
// 		value: '8',
// 		name: 'Wide Right 3|3|6',
// 		template: '<div class="col-sm-3 c0 column"></div><div class="col-sm-3 c1 column"></div><div class="col-sm-6 c2 column"></div>'
// 	},	
// 	{
// 		value: '9',
// 		name: 'Special',
// 		template: '<div class="col-sm-3 hidden-xs c0 column"></div><div class="col-sm-3 c1 hidden-xs column"></div><div class="col-sm-6 c2 column"></div>'
// 	},	{
// 	value: '9',
// 		name: 'Special No-form',
// 		template: '<div class="col-sm-3 hidden-xs c0 column"></div></div><div class="col-sm-9 c1 column"></div>'
// 	},
// ];

	widget_factory.prototype.layouts = [
		{
			value: '0',
			classes: 'bu-3-6-3',
			label: '<i title="Wide Middle" class="bu-3-6-3"></i>',
			template: '<div class="col-md-3 col-sm-4 c0 column"></div><div class="col-sm-8 col-md-6 c1 column"></div><div class="col-md-3 col-sm-12 c2 column"></div>'
		},
		{
			value: '1',
			classes: 'bu-6-3-3',
			label: '<i title="Wide Left" class="bu-6-3-3"></i>',
			template: '<div class="col-md-6 col-sm-8 c0 column"></div><div class="col-md-3 col-sm-4 c1 column"></div><div class="col-md-3 col-sm-12 c2 column"></div>'
		},
		{
			value: '2',
			classes: 'bu-4-4-4',
			label: '<i title="Even" class="bu-4-4-4"></i>',
			template: '<div class="col-md-4 col-sm-6 c0 column"></div><div class="col-md-4 col-sm-6 c1 column"></div><div class="col-md-4 col-sm-12 c2 column"></div>'
		},
		{
			value: '3',
			classes: 'bu-6-6',
			label: '<i title="Split" class="bu-6-6"></i>',
			template: '<div class="col-sm-6 c0 column"></div><div class="col-sm-6 c1 column"></div>'
		},
		{
			value: '4',
			classes: 'bu-12-12',
			label: '<i title="Full" class="bu-12-12"></i>',
			template: '<div class="col-lg-12 c0 column"></div>'
		},
		{
			value: '5',
			classes: 'bu-oddshape',
			label: '<i title="Odd Split" class="bu-oddshape"></i>',
			template: '<div class="col-sm-4 c0 column"></div><div class="col-sm-8"><div class="row"><div class="col-sm-12 c1 column"></div></div><div class="row"><div class="col-sm-6 c2 column"></div><div class="col-sm-6 c3 column"></div></div></div>'
		},
		{
			value: '6',
			classes: 'bu-doubledown',
			label: '<i title="Double Down" class="bu-doubledown"></i>',
			template: '<div class="col-sm-12"><div class="row"><div class="col-sm-12 c0 column"></div></div><div class="row"> <div class="col-sm-6 c1 column"></div><div class="col-sm-6 c2 column"></div></div><div class="row"><div class="col-sm-12 c3 column"></div></div></div>'
		},
		{
			value: '7',
			classes: 'bu-3-6-3',
			label: '<i title="Middle Only" class="bu-3-6-3"></i>',
			template: '<div class="col-lg-offset-3 col-md-offset-2  col-lg-6 col-md-8 col-sm-12 c0 column"></div></div>'
		},
		{
			value: '8',
			name: 'Wide Right 3|3|6',
			label: '<i title="Wide Right" class="bu-6-3-3"></i>',
			classes: 'bu-6-3-3 fa-rotate-180',
			template: '<div class="col-sm-3 c0 column"></div><div class="col-sm-3 c1 column"></div><div class="col-sm-6 c2 column"></div>'
		},	
		{
			value: '9',
			name: 'Special',
			classes: 'bu-3-6-3',
			template: '<div class="col-sm-3 hidden-xs c0 column"></div><div class="col-sm-3 c1 hidden-xs column"></div><div class="col-sm-6 c2 column"></div>'
		},	{
			value: '9',
			name: 'Special No-form',
			classes: 'bu-3-6-3',
			template: '<div class="col-sm-3 hidden-xs c0 column"></div></div><div class="col-sm-9 c1 column"></div>'
		},
	];
// $('body').keydown(function(event) {
// 	switch(event.keyCode) {
// 		case 27://escape
// 			for(var i in widget_factory.instances){
// 				widget_factory.instances[i].deselect();
// 			}
// 			break;
// 	}
// });

if (!!!templates) var templates = {};
templates["widgets_image"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<center class=\"collapsible\">");t.b("\n" + i);if(t.s(t.f("image",c,p,1),c,p,0,40,129,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		<img alt=\"");t.b(t.v(t.f("text",c,p,0)));t.b("\" src=\"/imgs/");t.b(t.v(t.f("image",c,p,0)));t.b("\" style=\"max-width:100%;margin-bottom:20px\">");t.b("\n" + i);});c.pop();}t.b("	");if(!t.s(t.f("image",c,p,1),c,p,1,0,0,"")){t.b("Click Here to choose an Image");};t.b("\n" + i);t.b("</center>");return t.fl(); },partials: {}, subs: {  }});
templates["widgets_slider"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div>");t.b("\n" + i);t.b("	<div class=\"panel panel-default on-collapse\">");t.b("\n" + i);t.b(t.rp("<widgets__header0",c,p,"		"));t.b("	</div>");t.b("\n" + i);t.b("	<div class=\"collapsible\">");t.b("\n" + i);t.b("	<div class=\"slider-wrapper theme-default\">");t.b("\n" + i);t.b("		<div class=\"ribbon\"></div>");t.b("\n" + i);t.b("			<div class=\"slider\" class=\"nivoSlider\">");t.b("\n" + i);if(t.s(t.f("images",c,p,1),c,p,0,241,316,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("				<a href=\"");t.b(t.v(t.f("url",c,p,0)));t.b("\"><img src=\"/imgs/");t.b(t.v(t.f("image",c,p,0)));t.b("\" alt=\"");t.b(t.v(t.f("text",c,p,0)));t.b("\" /></a>");t.b("\n" + i);});c.pop();}t.b("		</div>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {"<widgets__header0":{name:"widgets__header", partials: {}, subs: {  }}}, subs: {  }});
templates["widgets_poll"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"panel panel-default\">");t.b("\n" + i);t.b("<div class=\"panel-heading\" style=\"position:relative\">");t.b("\n" + i);t.b("	<h3 class=\"panel-title\">");t.b(t.v(t.f("title",c,p,0)));if(!t.s(t.f("title",c,p,1),c,p,1,0,0,"")){t.b(t.t(t.d("loaded.poll_name",c,p,0)));};t.b("</h3>");t.b("\n" + i);t.b("</div>");t.b("\n" + i);t.b("	<div class=\"collapsible panel-body ");if(t.s(t.f("collapsed",c,p,1),c,p,0,227,262,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("wf-collapsed\" style=\"display: none;");});c.pop();}t.b("\">");t.b("\n" + i);t.b("		<center>");t.b("\n" + i);t.b("			<div class=\"thumbnail\">");t.b("\n" + i);t.b("				<div class=\"caption\" style=\"text-align:left;overflow:hidden;min-height: 200px;\">");t.b("\n" + i);t.b("				</div>");t.b("\n" + i);t.b("			</div>");t.b("\n" + i);t.b("		</center>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["widgets__actions"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"btn-group pull-right actions parent-hover\" style=\"position:absolute;top:5px;right:5px;z-index:6\">");t.b("\n" + i);t.b("	<span class=\"btn btn-default btn-xs fa-pencil fa wf-edit\" title=\"Edit&nbsp;Settings\"></span>");t.b("\n" + i);t.b("	<span class=\"btn btn-default btn-xs fa-eye fa wf-manage\" title=\"Visibility&nbsp;Settings\"></span>");t.b("\n" + i);t.b("	<span class=\"btn btn-default btn-xs fa fa-minus wf-min\" title=\"Minimize\"></span>");t.b("\n" + i);t.b("	<span class=\"btn btn-danger btn-xs fa fa-times wf-remove\" title=\"Remove\"></span>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["widgets__header"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"panel-heading\" style=\"position:relative\">");t.b("\n" + i);t.b("	<h3 class=\"panel-title\">");t.b(t.v(t.f("title",c,p,0)));if(!t.s(t.f("title",c,p,1),c,p,1,0,0,"")){t.b(t.t(t.f("widgetType",c,p,0)));};t.b("</h3>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["widgets__limited_actions"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"btn-group pull-right actions parent-hover\" style=\"position:absolute;top:5px;right:5px;z-index:6\">");t.b("\n" + i);t.b("	");if(t.s(t.f("enable_min",c,p,1),c,p,0,126,203,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<span class=\"btn btn-default btn-xs fa fa-minus wf-min\" title=\"Minimize\"></span>");});c.pop();}t.b("\n" + i);t.b("	");if(t.s(t.f("user_edit",c,p,1),c,p,0,234,312,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<span class=\"btn btn-default btn-xs fa fa-pencil wf-edit\" title=\"Edit\"></span>");});c.pop();}t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["widgets_container"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div style=\"position:relative;min-height:30px\" class=\"widget ");t.b(t.v(t.f("device",c,p,0)));t.b(" ");if(t.s(t.f("collapsed",c,p,1),c,p,0,86,98,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("wf-collapsed");});c.pop();}t.b("\" id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\">");t.b("\n" + i);t.b(t.rp("<widgets__limited_actions0",c,p,"	"));t.b("</div>");return t.fl(); },partials: {"<widgets__limited_actions0":{name:"widgets__limited_actions", partials: {}, subs: {  }}}, subs: {  }});
templates["widgets_content"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"panel panel-default\">");t.b("\n" + i);t.b(t.rp("<widgets__header0",c,p,"	"));t.b("	<div class=\"collapsible panel-body\">");t.b("\n" + i);t.b("		<div>");t.b("\n" + i);t.b("		");t.b(t.t(t.f("text",c,p,0)));t.b("\n" + i);t.b("		</div>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {"<widgets__header0":{name:"widgets__header", partials: {}, subs: {  }}}, subs: {  }});
templates["widgets_edit_container"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div style=\"position:relative;min-height:30px\" class=\"widget ");if(t.s(t.f("collapsed",c,p,1),c,p,0,75,87,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("wf-collapsed");});c.pop();}t.b("\" id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\">");t.b("\n" + i);t.b(t.rp("<widgets__actions0",c,p,"	"));t.b("</div>");return t.fl(); },partials: {"<widgets__actions0":{name:"widgets__actions", partials: {}, subs: {  }}}, subs: {  }});
templates["widgets_events"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"panel panel-default\">");t.b("\n" + i);t.b("	<div class=\"panel-heading\" style=\"position:relative\">");t.b("\n" + i);t.b("		<h3 class=\"panel-title\"><i class=\"fa fa-list-ul\"></i> ");t.b(t.v(t.f("title",c,p,0)));if(!t.s(t.f("title",c,p,1),c,p,1,0,0,"")){t.b(t.v(t.d("loaded.title",c,p,0)));if(!t.s(t.d("loaded.title",c,p,1),c,p,1,0,0,"")){t.b(t.t(t.f("widgetType",c,p,0)));};};t.b("  </h3>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("	<div class=\"panel-body collapsible\" style=\"padding:0\">");t.b("\n" + i);t.b("		<div class=\"list-group\" style=\"margin-bottom:0\">");t.b("\n" + i);if(t.s(t.f("loaded",c,p,1),c,p,0,376,570,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		  <a href=\"javascript:void(0);\" class=\"list-group-item\">");if(t.s(t.f("summary",c,p,1),c,p,0,447,458,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(t.t(t.f("value",c,p,0)));});c.pop();}t.b(" ");t.b("\n" + i);t.b("				<abbr class=\"timeago pull-right\" title=\"");if(t.s(t.f("dtstart",c,p,1),c,p,0,528,537,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(t.v(t.f("value",c,p,0)));});c.pop();}t.b("\"></abbr>");t.b("\n" + i);t.b("		  </a>");t.b("\n" + i);});c.pop();}t.b("		</div>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["widgets_html"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"collapsible\">");t.b("\n" + i);t.b("		");t.b(t.t(t.f("html",c,p,0)));t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["widgets_image"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<center class=\"collapsible\">");t.b("\n" + i);if(t.s(t.f("image",c,p,1),c,p,0,40,129,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		<img alt=\"");t.b(t.v(t.f("text",c,p,0)));t.b("\" src=\"/imgs/");t.b(t.v(t.f("image",c,p,0)));t.b("\" style=\"max-width:100%;margin-bottom:20px\">");t.b("\n" + i);});c.pop();}t.b("	");if(!t.s(t.f("image",c,p,1),c,p,1,0,0,"")){t.b("Click Here to choose an Image");};t.b("\n" + i);t.b("</center>");return t.fl(); },partials: {}, subs: {  }});
templates["widgets_links"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"panel-group\" id=\"");t.b(t.v(t.f("guid",c,p,0)));t.b("\" role=\"tablist\" aria-multiselectable=\"true\">");t.b("\n" + i);t.b("  <div class=\"panel panel-default\">");t.b("\n" + i);if(t.s(t.f("groups",c,p,1),c,p,0,131,804,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		<div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">");t.b("\n" + i);t.b("      <h4 class=\"panel-title\">");t.b("\n" + i);t.b("        <a data-toggle=\"collapse\" href=\"#");t.b(t.v(t.f("title",c,p,0)));t.b("\" aria-expanded=\"true\" aria-controls=\"");t.b(t.v(t.f("title",c,p,0)));t.b("\">");t.b("\n" + i);t.b("          ");t.b(t.v(t.f("title",c,p,0)));t.b("\n" + i);t.b("        </a>");t.b("\n" + i);t.b("      </h4>");t.b("\n" + i);t.b("    </div>");t.b("\n" + i);t.b("    <div id=\"");t.b(t.v(t.f("title",c,p,0)));t.b("\" class=\"panel-collapse collapse in\" role=\"tabpanel\" aria-labelledby=\"");t.b(t.v(t.f("title",c,p,0)));t.b("\">");t.b("\n" + i);t.b("      <div class=\"panel-body\" style=\"padding:0\">");t.b("\n" + i);t.b("      	<div class=\"list-group\" style=\"margin-bottom:0\">");t.b("\n" + i);if(t.s(t.f("links",c,p,1),c,p,0,603,757,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("						<a href=\"");t.b(t.v(t.f("link",c,p,0)));t.b("\" target=\"blank\" class=\"list-group-item\" style=\"color:#005A43\"><img height=\"16px\" src=\"");t.b(t.v(t.f("link",c,p,0)));t.b("/favicon.ico\"/> ");t.b(t.v(t.f("title",c,p,0)));t.b("</a>");t.b("\n" + i);});c.pop();}t.b("				</div>");t.b("\n" + i);t.b("      </div>");t.b("\n" + i);t.b("    </div>");t.b("\n" + i);});c.pop();}t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["widgets_poll"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"panel panel-default\">");t.b("\n" + i);t.b("<div class=\"panel-heading\" style=\"position:relative\">");t.b("\n" + i);t.b("	<h3 class=\"panel-title\">");t.b(t.v(t.f("title",c,p,0)));if(!t.s(t.f("title",c,p,1),c,p,1,0,0,"")){t.b(t.t(t.d("loaded.poll_name",c,p,0)));};t.b("</h3>");t.b("\n" + i);t.b("</div>");t.b("\n" + i);t.b("	<div class=\"collapsible panel-body ");if(t.s(t.f("collapsed",c,p,1),c,p,0,227,262,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("wf-collapsed\" style=\"display: none;");});c.pop();}t.b("\">");t.b("\n" + i);t.b("		<center>");t.b("\n" + i);t.b("			<div class=\"thumbnail\">");t.b("\n" + i);t.b("				<div class=\"caption\" style=\"text-align:left;overflow:hidden;min-height: 200px;\">");t.b("\n" + i);t.b("				</div>");t.b("\n" + i);t.b("			</div>");t.b("\n" + i);t.b("		</center>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["widgets_rss"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"panel panel-default\">");t.b("\n" + i);t.b("	<div class=\"panel-heading\" style=\"position:relative\">");t.b("\n" + i);t.b("		<h3 class=\"panel-title\"><i class=\"fa fa-list-ul\"></i> ");t.b(t.v(t.f("title",c,p,0)));if(!t.s(t.f("title",c,p,1),c,p,1,0,0,"")){t.b(t.v(t.d("loaded.title",c,p,0)));if(!t.s(t.d("loaded.title",c,p,1),c,p,1,0,0,"")){t.b(t.t(t.f("widgetType",c,p,0)));};};t.b("  </h3>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("	<div class=\"panel-body collapsible\" style=\"padding:0\">");t.b("\n" + i);t.b("		<div class=\"list-group\" style=\"margin-bottom:0\">		");t.b("\n" + i);if(t.s(t.d("loaded.entries",c,p,1),c,p,0,386,541,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		  <div class=\"list-group-item\"><a href=\"");t.b(t.v(t.f("link",c,p,0)));t.b("\" target=\"_blank\" ><h4>");t.b(t.v(t.f("title",c,p,0)));t.b("</h4></a><div style=\"max-width:100%\">");t.b(t.t(t.f("contentSnippet",c,p,0)));t.b("</div></div>");t.b("\n" + i);});c.pop();}t.b("		</div>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["widgets_slider"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div>");t.b("\n" + i);t.b("	<div class=\"panel panel-default on-collapse\">");t.b("\n" + i);t.b(t.rp("<widgets__header0",c,p,"		"));t.b("	</div>");t.b("\n" + i);t.b("	<div class=\"collapsible\">");t.b("\n" + i);t.b("	<div class=\"slider-wrapper theme-default\">");t.b("\n" + i);t.b("		<div class=\"ribbon\"></div>");t.b("\n" + i);t.b("			<div class=\"slider\" class=\"nivoSlider\">");t.b("\n" + i);if(t.s(t.f("images",c,p,1),c,p,0,241,316,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("				<a href=\"");t.b(t.v(t.f("url",c,p,0)));t.b("\"><img src=\"/imgs/");t.b(t.v(t.f("image",c,p,0)));t.b("\" alt=\"");t.b(t.v(t.f("text",c,p,0)));t.b("\" /></a>");t.b("\n" + i);});c.pop();}t.b("		</div>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {"<widgets__header0":{name:"widgets__header", partials: {}, subs: {  }}}, subs: {  }});
templates["widgets_special_content"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"panel panel-default ");if(t.s(t.f("collapsed",c,p,1),c,p,0,46,58,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("wf-collapsed");});c.pop();}t.b("\">");t.b("\n" + i);t.b(t.rp("<widgets__header0",c,p,"	"));t.b("	<div class=\"panel-body collapsible\">");t.b("\n" + i);t.b("		<div class=\"ui-bullet\">");t.b("\n" + i);t.b("		  <div class=\"btn-icon btn-icon-round btn-icon-lg bg-");t.b(t.v(t.f("color",c,p,0)));t.b("\">");t.b("\n" + i);t.b("		    <i class=\"");t.b(t.v(t.f("icon",c,p,0)));t.b("\"></i>");t.b("\n" + i);t.b("		  </div>");t.b("\n" + i);t.b("		  <div class=\"ui-bullet-content\">");t.b("\n" + i);t.b("			  <h3>");t.b(t.v(t.f("title",c,p,0)));t.b("</h3>");t.b("\n" + i);t.b("			  <p>");t.b(t.t(t.f("text",c,p,0)));t.b("</p>");t.b("\n" + i);t.b("		  </div>");t.b("\n" + i);t.b("		</div>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {"<widgets__header0":{name:"widgets__header", partials: {}, subs: {  }}}, subs: {  }});
