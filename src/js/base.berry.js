//		BerryJS 0.9.4
//		(c) 2011-2015 Adam Smallcomb
//		Licensed under the MIT license.
//		For all details and documentation:
//		https://github.com/Cloverstone/Berry
// 
// 

// toarray, multiple, flatten

//	internal structure
		// attributes = {
		// 	name: {
		// 	 first: '',
		// 	 last:''
		// 	},
		// 	age: '',
		// 	addresses: [
		// 		{state: '', zip: ''}
		// 	]

		// }

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
	 * then just the value of that field is returned.
	 *
	 * @param {string} s Name of the field to return the value of.
	 * @param {booleon} validate Indicates whether or not to validate
	 * the values befor returning the results.
	 */
	this.toJSON = function(s, validate) {
		// validate if desired this.valid will hold the result
		if(validate || !this.valid) { this.validate(); }

		// if a search string return the valu of the field with that name
		if(typeof s === 'string' && s.length > 0){
			return this.find(s).getValue();
		} else {
			return this.parsefields(this.options);
		}
	};


	// var processMultiples = function(attributes) {
	// 	var altered = $.extend(true, {}, attributes);
	// 	this.each(function(attributes, altered) {
	// 		if(this.multiple && this.toArray){
	// 			var root = attributes;
	// 			var temp = Berry.search(root, this.getPath());
	// 			if(this.isChild()){
	// 				root = Berry.search(altered, this.parent.getPath());
	// 			}
	// 			root[this.name] = {};
	// 			for(var i in this.children) {
	// 				root[this.name][i] = $.pluck(temp,i);
	// 			}
	// 		}
	// 	}, [attributes, altered]);
	// 	return altered;
	// };

	/**
	 * Gets the values for all of the fields and structures them according to the 
	 * configuration of the option 'flatten' and 'toArray'
	 *
	 * @param {object} attributes The values for the fields to be populated
	 * @param {?array} fields These are the fields that the attributes will be applied to
	 * the values befor returning the results.
	 */
	this.populate = function(attributes, fields) {
		// attributes = attributes || this.attributes;
		fields = fields || this.fields;

		this.each(function(attributes) {
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
			var state = this.processField(normalizeItem(fields[i], i, this.options.default), target, parent);
		}

	};

	/**
	 * Takes the item descriptor passed in and makes sure the required attributes
	 * are set and if they are not tries to apply sensible defaults
	 *
	 * @param {object} item This is the raw field descriptor to be normalized
	 * @param {string or int} i The key index of the item
	 */
	var normalizeItem = function(item, i, defaultItem){
		if(typeof item === 'string') {
			item = { type : item, label : i };
		}
		item = $.extend({}, defaultItem, item);

		//if no name given and a name is needed, check for a given id else use the key
		if(typeof item.name === 'undefined' && !item.isContainer){
			if(typeof item.label !== 'undefined' && !isNaN(parseFloat(i))){
				item.name = item.label.toLowerCase().split(' ').join('_');
			}else if(typeof item.id !== 'undefined') {
				item.name = item.id;
			} else {
				item.name = i.toLowerCase().split(' ').join('_');
			}
		}
		if(typeof item.label === 'undefined' && item.label !== false) {
			item.label = i;
		}

		// Sync the validation with the 'required' shorthand
		if(item.required){
			$.extend(item,{validate: {required: true}});
		} else if(typeof item.validate !== 'undefined'){
			item.required = item.validate.required;
		}

		// Set a sensible type default if type is not defined or not found
		if(typeof Berry.types[item.type] === 'undefined') {
			if(typeof item.choices === 'undefined' && typeof item.options === 'undefined'){
				item.type = 'text';
			}else{

				if(item.options.length ==  1){
					item.type = 'checkbox';
					item.name = item.options[0].toLowerCase().split(' ').join('_');
				}else 
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
		var current = this.addField(item, parent, target, insert);
		this.initializing[current.id] = true;
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
		// return current;
	};

	this.addField = function(item , parent, target, insert) {
		var current = new Berry.types[item.type](item, this);
		current.parent = parent;

		var root = this.fields;
		if(parent !== null && parent !== undefined) {
			root = parent.children;
		}

		var exists = (root[current.name] !== undefined);

		if(current.isContainer) {
			if(!exists) {
				root[current.name] = { isContainer: true , multiple: current.multiple , hasChildren: !$.isEmptyObject(item.fields) /*, toArray: (current.item.toArray || current.owner.options.flatten)*/, instances:[] };
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
					var temp = [];
					temp.push(root[current.name]);
					temp = root[current.name];
					root[current.name] = {multiple:current.multiple, hasChildren:!$.isEmptyObject(item.fields), instances:[]};
					root[current.name].instances.push(temp);
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

	this.parsefields = function(options) {
		var newAttributes = {};//$.extend(true, {}, attributes);
		debugger;
		// var newAttributes = JSON.parse(JSON.stringify(attributes))
		this.each(function(newAttributes, options) {
			if(this.isParsable) {
				var root;
				if(this.isChild() && (!options.flatten || typeof this.parent.multiple !== 'undefined')/*|| (this.instance_id !== null)*/){
					root = Berry.search(newAttributes, this.parent.getPath());
				} else {
				//if(typeof root === 'undefined'){
					root = newAttributes;
				}
				if(!this.isContainer) {
					var value = this.getValue();
					if(value === null){
						value = '';
					}
					if($.isArray(root)){
						if(!root[this.parent.instance_id]) { root[this.parent.instance_id] = {}; }
						root[this.parent.instance_id][this.name] = value;
					}else{
						root[this.name] = value;
					}
				}else{
					if(this.multiple){
						root[this.name] = root[this.name]||[];
					}else{
						if(!options.flatten){
							root[this.name] = {};
						}
					}
				}

			}
		}, [newAttributes, options]);
		return newAttributes;
	};


	this.setActions = function(actions) {
		if(!this.options.actionTarget) {
			this.options.actionTarget = $('<div class="berry-actions" style="overflow:hidden;padding-bottom:10px"></div>');
			this.target.append(this.options.actionTarget);
		}
		this.options.actionTarget.empty();

		if(actions) {
			actions = containsKey(Berry.btn, actions);
			for(var action in actions) {
				var temp = $(Berry.render('berry__action', actions[action]));
					if(typeof actions[action].click === 'function'){
						temp.click($.proxy(actions[action].click, this));
					}
				this.options.actionTarget.append(temp);
			}
		}
	};

	this.inflate = function(atts) {
		var altered = {};

		this.each(function(atts, altered) {

			var val;

			if(this.isContainer){
				if(this.multiple){
					val = [];
				}else{
					val = {};
				}
			}else{
				val = atts[this.name];
			}

			if(this.isChild()){
				Berry.search(altered, this.parent.getPath())[this.name] = val;
			} else {
				altered[this.name] = val;
			}

		}, [atts, altered]);

		return altered;
	};

	// var inflate = function(o, n) {
	// 	for(var i in n) {
	// 		if(typeof n[i] === 'object' && !$.isArray(n[i])) {
	// 			if(i in o) {
	// 				n[i] = inflate(o[i], n[i]);
	// 			} else {
	// 				n[i] = inflate(o, n[i]);
	// 			}
	// 		} else {
	// 			if(i in o) {
	// 				n[i] = o[i];
	// 			}
	// 		}
	// 	}
	// 	return n;
	// };

	this.initializefield = function(id){
		delete this.initializing[id];
		this.fieldsinitialized = $.isEmptyObject(this.initializing);
		if(this.fieldsinitialized) {
			this.trigger('fieldsinitialized');
		}
	}

	this.load = function(){
		if(typeof this.options.attributes !== 'undefined'){
			if(this.options.flatten){
				//this.options.other = inflate($.extend(true, {}, this.options.attributes), $.extend(true, {}, this.options.attributes)) || {};
				this.options.attributes = this.inflate(this.options.attributes);
			}
			// Fill the form with any values we have
			this.populate(this.options.attributes);
		}
		if(this.options.autoFocus){
			this.each(function(){
				this.focus();
				return false;
			});
		}
	};

	this.on('fieldsinitialized', function(){
		this.load();
		this.initialized = true;
		this.trigger('initialized');
	});

	this.$el = target;

	// Track sections for tabs, pages, wizard etc.
	this.section_count = 0;
	this.sectionsEnabled = false;
	this.sections = [];
	this.sectionList = [];
	this.initializing = {};

	// flags for progress
	this.fieldsinitialized = false;
	this.initialized = false;

	// Initialize objects/arrays
	var rows = {};
	this.fieldsets = [];
	this.fields = {};

	// This holds the current attributes of the form
	// this.attributes = {};

	this.options = $.extend({name: Berry.getUID()}, Berry.options, options);
	this.events = $.extend({}, Berry.prototype.events);

	Berry.instances[this.options.name] = this;

	this.trigger('initialize');

	// Give renderers and other plugins a chance to default this
	if(typeof this.$el === 'undefined') { this.$el = $('<div/>'); }

	// Now the we have an element to work with instantiate the renderer
	this.renderer = new Berry.renderers[this.options.renderer](this);

	// Render and get the target returned from the renderer
	this.target = this.renderer.render();

	// Create the legend if not disabled
	if(this.options.legend && this.options.legendTarget) { this.options.legendTarget.append(this.options.legend); }

	// Process the fields we were given and apply them to the target
	// we got from the renderer
	this.processfields(this.options.fields, this.target, null);


	this.setActions(this.options.actions);


	// Allow the renderer to initialize
		if(typeof this.renderer.initialize === 'function') {
			this.renderer.initialize();
		}



	// // may not be needed
	// this.each(function(){
	// 	this.trigger('change');
	// })


	// if(typeof Berry.instances[this.options.name] !== 'undefined') {
	// 	Berry.instances[this.options.name].on('destroyed', $.proxy(function(){
	// 		Berry.instances[this.options.name] = this;
	// 	},this));
	// 	Berry.instances[this.options.name].destroy();
	// }else{

};
