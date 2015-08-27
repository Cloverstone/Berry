//		BerryJS 0.9.3.4
//		(c) 2011-2015 Adam Smallcomb
//		Licensed under the MIT license.
//		For all details and documentation:
//		https://github.com/Cloverstone/Berry

Berry = function(options, target) {
	/**
	 * Destroys the global reference to this form instance, empties the fieldsets that 
	 * were used and calls the destroy function on each field.
	 */
	this.destroy = function() {
		this.trigger('destroy');

		//Trigger the destroy methods for each field
		this.each(function() {if(typeof this.destroy === 'function') {this.destroy();}});

		//Clean up affected containers
		this.$el.empty();
		for(var i = this.fieldsets.length-1;i >=0; i--) { $(this.fieldsets[i]).empty(); }

		//Dispatch the destroy method of the renderer we used
		if(typeof this.renderer.destroy === 'function') { this.renderer.destroy(); }

		//Remove the global reference to our form
		delete Berry.instances[this.options.name];

		this.trigger('destroyed');
	};

	/**
	 * Gets the values for all of the fields and structures them according to the 
	 * configuration of the option 'flatten' and 'toArray'. If field name is requested
	 * then jut the value of that field is returned.
	 *
	 * @param {string} s Name of the field to return the value of.
	 * @param {booleon} validate Indicates whether or not to validate
	 * the values befor returning the results.
	 */
	this.toJSON = function(s, validate) {
		// validate if desired this.valid will hold the result
		if(validate) { this.validate(); }

		// if a search string return the valu of the field with that name
		if(typeof s === 'string'){
			return this.find(s).getValue();
		} else {
			var working = processMultiples(parsefields(this.attributes));
			if(this.options.flatten) {
				var deflated = [];
				this.each(flatten, [working, deflated, deflate]);
				working = deflate(working);
			}
			return working;
		}
	};

	/**
	 * Gets the values for all of the fields and structures them according to the 
	 * configuration of the option 'flatten' and 'toArray'
	 *
	 * @param {object} attributes The values for the fields to be populated
	 * @param {?array} fields These are the fields that the attributes will be applied to
	 * the values befor returning the results.
	 */
	this.populate = function(attributes, fields) {
		attributes = attributes || this.attributes
		fields = fields || this.fields;

		//If multiple instances should exist then build out the tree
		this.each(function(attributes) {
			if(this.multiple) {
				var temp = {};
				temp = Berry.search(attributes, this.getPath());
				if(temp) {
					var skip = true;
					for(var i in temp) {
						if(!skip) {
							this.owner.processField($.extend(true, {}, this.item, {id: Berry.getUID(), name: this.name}), $(this.self), this.parent, 'after');
						} else { skip = false; }
					}
				}
			}
		}, [attributes], fields);

		self.each(function(attributes) {
			if(!this.isContainer) {
				var temp = Berry.search(attributes, this.getPath());
				if(typeof temp !== 'undefined' && typeof temp !== 'object') { 
					this.setValue(temp);
					this.trigger('change');
					this.toJSON();
				}
			}
		}, [attributes], fields);
	};

	/**
	 * Format the field values properly in th array
	 *
	 * @param {object} attributes The values for the fields to be populated
	 * @internal
	 */
	var processMultiples = function(attributes) {
		var altered = $.extend(true, {}, attributes);
		self.each(function(attributes, altered) {
			if(this.multiple && this.toArray){
				var root = attributes;
				var temp = Berry.search(root, this.getPath());
				if(this.isChild()){
					root = Berry.search(altered, this.parent.getPath());
				}
				root[this.name] = {};
				for(var i in this.children) {
					root[this.name][i] = $.pluck(temp, i);
				}
			}
		}, [attributes, altered]);
		return altered;
	};

	/**
	 * Normalize the field values properly in th array
	 *
	 * @internal
	 */
	var processMultiplesIN = function() {
		self.each(function() {

			var root = this.owner.attributes[this.name];
			if(this.multiple && this.toArray) {

				if(this.isChild()){
					root = Berry.search(this.owner.attributes, this.getPath(true));
				}
				if(root) {
					var temp = $.extend(true,{},root[this.name]);
					root[this.name] = [];
					var	source = this.owner.source;
					if(this.isChild()){
						source = Berry.search(this.owner.source, this.parent.getPath());
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
				var sourceRef = this.owner.source[this.name];
				if(sourceRef !== null){
					if(typeof sourceRef === 'object'){
						if($.isArray(sourceRef)){
							root = $.extend([],sourceRef);
						}else{
							root = $.extend({},sourceRef);
						}
					}else{
						root = sourceRef;
					}
				}
			}
		});
		return self.attributes;
	};

	/**
	 * Push the values into the structure dictated by the input field object
	 *
	 * @param {} o 
	 * @param {} n 
	 * @internal
	 */
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
	var flatten = function(working, deflated, deflate) {
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
				Berry.search(working, temp)[name] = deflate(Berry.search(working, this.getPath()));
			} else {
				if(name) {
					working[name] = deflate(Berry.search(working, this.getPath()));
				}else{
					$.extend(working, deflate(Berry.search(working, this.name)));
					delete working[this.name];
				}
			}
			deflated.push(this.name);
			}else{
				deflated.push(this.name);
				$.extend(working, deflate(working[this.name]));
				delete working[this.name];
			}
		}
	};
	var deflate = function(o) {
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


	/**
	 * 
	 *
	 * @param {function} toCall 
	 * @param {?array} args 
	 * @param {?array} fields 
	 */
	this.each = function(toCall, args, fields) {
		fields = (fields || this.fields);
		var c = true;
		for(var i in fields) {
			if(c !== false){
				var field = fields[i];
				if(field.item) {
					if(field.isActive()) {
						c = toCall.apply(field, args);
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

	/**
	 * 
	 *
	 * @param {string} s  This is the path or name of the field you are looking for
	 * @param {?array} fields These are the fields to be searched
	 */
	this.find = function(s, fields){
		var items = [];
		this.each(function(s, items) {
			if(this.getPath() == s || this.name == s){
				items.push(this);
			}
		}, [s, items], (fields || this.fields));
		if(items.length == 0){
			return false;
		}
		if(items.length > 1 || items[0].multiple){
			return items;
		}
		return items[0];
	};

	/**
	 * 
	 *
	 * @param {string} id This is the id you are looking for
	 * @param {?array} fields These are the fields to be searched
	 */
	this.findByID = function(id, fields){
		var items = [];
		this.each(function(id, items) {
				if(this.id == id){
					items.push(this);
				}
		}, [id, items], (fields || this.fields));
		return items[0];
	};

	/**
	 * Iterates over an array of fields and normalizes the field before passing it on to be 
	 * processed
	 *
	 * @param {?array} fields These are the fields we are going to process
	 * @param {element} target Target is the default element where new fields should be added
	 * @param {Berry.field} parent This is the parent field
	 */
	this.processfields = function(fields, target, parent) {
		for(var i in fields) {
			this.processField(normalizeItem(fields[i], i), target, parent);
		}
	};

	/**
	 * Takes the item descriptor passed in and makes sure the required attributes
	 * are set and if they are not tries to apply sensible defaults
	 *
	 * @param {object} item This is the raw field descriptor to be normalized
	 * @param {string or int} i The key index of the item
	 */
	var normalizeItem = function(item, i){
		if(typeof item === 'string'){
			item = { type : item, label : i };
		}
		item = $.extend({}, self.options.default, item);
		//if no name given and a name is needed, check for a given id else use the key
		if(typeof item.name === 'undefined' && !item.isContainer){
			if(typeof item.id !== 'undefined') {
				item.name = item.id;
			} else {
				item.name = i.toLowerCase().split(' ').join('_');
			}
		}
		if(typeof item.label === 'undefined' && item.label !== false) {
			item.label = i;
		}
		if(item.required){
			$.extend(item,{validate: {required: true}});
		}
		if(typeof item.validate !== 'undefined'){
			item.required = item.validate.required;
		}

		if(typeof Berry.types[item.type] === 'undefined') {
			if(typeof item.choices === 'undefined' && typeof item.options === 'undefined'){
				item.type = 'text';
			}else{
				if(item.options.length <= 3){
					item.type = 'radio';
				}else{
					item.type = 'select';
				}
			}
		}
		return item;
	};

	/**
	 * 
	 *
	 * @param {object} item This is the field descriptor to be processed
	 * @param {element} target Target is the default element where new fields should be added
	 * @param {Berry.field} parent This is the parent field
	 * @param {string} insert Location relative to target to place the new field
	 */
	this.processField = function(item, target, parent, insert) {
		if(target[0] !== undefined){target = target[0];}
		var current = addField(item, parent, target, insert);
		if(typeof current.fieldset === 'undefined') { current.fieldset = target; }

		if(insert == 'before') {
			$(target).before(current.render());
		} else if(insert == 'after') {
			$(target).after(current.render());
		} else {
			if(current.item.type !== 'fieldset' ||  current.isChild() || !this.sectionsEnabled) {
				var currentRow;
				if(typeof $(current.fieldset).children('.row').last().attr('id') !== 'undefined') {
					currentRow = rows[$(current.fieldset).children('.row').last().attr('id')];		
				}
				if(typeof currentRow === 'undefined' || (currentRow.used + parseInt(current.columns,10) + parseInt(current.offset,10)) > this.options.columns){
					var temp = Berry.getUID();
					currentRow = {};
					currentRow.used = 0;
					currentRow.ref = $(Berry.render('berry_row', {id: temp}));
					rows[temp] = currentRow;
					$(current.fieldset).append(currentRow.ref);
				}
				currentRow.used += parseInt(current.columns, 10);
				currentRow.used += parseInt(current.offset, 10);
				currentRow.ref.append( $('<div/>').addClass('col-md-' + current.columns).addClass('col-md-offset-' + current.offset).append(current.render()) );
			}else{
				$(current.fieldset).append(current.render() );
			}
		}
		current.initialize();
		return current;
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

	var parsefields = function(attributes) {
		// var newAttributes = $.extend(true, {}, attributes);
		var newAttributes = JSON.parse(JSON.stringify(attributes))
		self.each(function(newAttributes) {
			if(!this.isContainer && this.isParsable) {
				var temp;
				if(this.isChild() || (this.instance_id !== null)){
					temp = Berry.search(newAttributes, this.parent.getPath());
				}
				if(typeof temp === 'undefined'){
					temp = newAttributes;
				}
				if($.isArray(temp)){
					if(!temp[this.parent.instance_id]) { temp[this.parent.instance_id] = {}; }
					temp[this.parent.instance_id][(this.attribute || this.name)] = this.getValue();
				}else{
					temp[(this.attribute || this.name)] = this.getValue();
				}
			}
		}, [newAttributes]);
		return newAttributes;
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
	this.$el = target;

	// Track sections for tabs, pages, wizard etc.
	this.section_count = 0;
	this.sectionsEnabled = false;
	this.sections = [];
	this.sectionList = [];

	// Initialize objects/arrays
	var rows = {};
	this.fieldsets = [];
	this.fields = [];
	this.source = {};
	this.attributes = {};
	this.options = $.extend({name: Berry.getUID()}, Berry.options, options);
	this.events = $.extend({}, Berry.prototype.events);

	this.trigger('initialize');

	// Give renderers and other plugins a chance to default this
	if(typeof this.$el === 'undefined') { this.$el = $('<div/>'); }

	// Now the we have an element to work with instantiate the renderer
	this.renderer = new Berry.renderers[this.options.renderer](this);

	// Render and get the target returned from the renderer
	this.target = this.renderer.render();

	// Create the legend if not disabled
	if(this.options.legend && this.options.legendTarget){
		this.options.legendTarget.append(this.options.legend);
	}

	// Process the fields we were given adn apply them to the target
	// we got from the renderer
	this.processfields(this.options.fields, this.target, null);


	// Process any attributes that were passed in to normalize them to the internal structure
	if(typeof this.options.attributes !== 'undefined') {
		if(this.options.attributes === 'hash'){this.options.attributes = window.location.hash.replace('#', '').split('&').map(function(val){return val.split('=');}).reduce(function ( total, current ) {total[ current[0] ] = current[1];return total;}, {});}
		this.source = $.extend(true, {}, this.options.attributes);

		if(this.options.flatten){
			this.source = inflate($.extend(true, {}, this.source), $.extend(true, {}, processMultiples(this.attributes))) || {};
		}
		processMultiplesIN();
		this.each(function() {
			if(this.multiple) {
				this.createAttributes();
			}
		});
	}

	// Fill the form with any values we have
	this.populate(this.source);

	addActions(this.options.actions);

	// Allow the renderer to initialize
	if(typeof this.renderer.initialize === 'function') {
		this.renderer.initialize();
	}

	if(this.options.autoFocus){
		this.each(function(){
			this.focus();
			return false;
		});
	}

	// may not be needed
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
			var temp = self.findByID(info.id);
			Berry.search(self.attributes, info.path).splice(temp.instance_id, 1);
			if(temp.isChild()){
				temp.parent.children[temp.name].instances.splice(temp.instance_id, 1);
			}else{
				self.fields[temp.name].instances.splice(temp.instance_id, 1);
			}
		});

		this.trigger('initialized');
};


Berries = Berry.instances = {};
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
	autoDestroy: false,
	autoFocus: true,
	actions: ['cancel', 'save']
};

Berry.register = function(elem) {
	if(elem.extends && typeof Berry.types[elem.extends] !== 'undefined'){
		Berry.types[elem.type] = Berry.types[elem.extends].extend(elem);
	}else{
		Berry.types[elem.type] = Berry.field.extend(elem);
	}
};

/**
 * 
 *
 * @param {array} o The array of fields to be searched
 * @param {string} s The path 
 * @internal
 */
Berry.search = function(o, s) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		// s = s.replace(/^\./, '');           // strip a leading dot
		var a = s.split('.');
		while (a.length) {
			var n = a.shift();
			if (typeof o !== 'undefined' && n in o) {
				o = o[n];
			} else {
				return o;
			}
		}
		return o;
	};


$((function($){
	$.fn.berry = function(options) {
		return new Berry(options, this);
	};
})(jQuery));
