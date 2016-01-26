Berry.backbone = true;
Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		if(typeof this.options.model !== 'undefined'){
			this.on('save', function() {
				if(this.validate()){
					// this.options.model.save(this.toJSON() , {wait: true, patch: true, success: $.proxy(function(){
					// 	this.trigger('saved');
					// }, this)});
					this.trigger('saveing');
					this.options.model.set(this.toJSON());
					this.trigger('saved');
				}
				return this.valid;
			});
			
			
			//may be more universal way to do thisd
			var list = this.options.model.schema;
			var returnArray = {};
			var keys = this.options.fields;
			if(keys === 'all' || typeof this.options.fields === 'undefined'){
				this.options.fields = list;
			}else{
				for (var key in keys) {
					if(typeof keys[key] === 'string'){
						if(typeof list[keys[key]] !== 'undefined'){
							returnArray[keys[key]] = list[keys[key]];
						}
					}else{
						returnArray["key_"+key] = keys[key];
					}
				}
				this.options.fields = returnArray;
			}

			if(typeof this.options.attributes === 'undefined' || $.isEmptyObject(this.options.attributes)) {
				this.options.attributes = this.options.model.toJSON();

				this.options.model.on('change', function(){
					for(var i in this.options.model.changed){
						var temp = this.find(i);
						if(temp && !$.isArray(temp)) {
							temp.set(this.options.model.changed[i]);
						}
					}
				}, this);

				this.on('destroy',function(){
					this.options.model.off('change', null, this);
				});
			}
		}
	}
});

Berry.register({
	type: 'fieldset',
	getValue: function() { return null;},
	create: function() {
		this.name = this.name || Berry.getUID();
		this.owner.fieldsets.push(this.name);
		if(!this.isChild()){
			++this.owner.section_count;
			this.owner.sections.push(this);
			this.owner.sectionList.push({'index': this.owner.section_count, 'text': this.item.legend, state: 'disabled', completed: false, active: false, error: false});
		}
		return this.owner.renderer.fieldset(this);
	},
	focus: function(){
		this.owner.each(function(){
			this.focus();
			return false;
		}, {}, this.children);
		return false;
	},
	setValue: function(value){return true;},
	setup: function() {

		if(typeof this.fields !== 'undefined') {
			// if(typeof this.owner.options.model !== 'undefined') {
			// 	var list = this.owner.options.model.schema;
			// 	var returnArray = {};
			// 	var keys = this.fields;
			// 	for (var key in keys) {
			// 		if(typeof keys[key] === 'string'){
			// 			if(typeof list[keys[key]] !== 'undefined'){
			// 				returnArray[keys[key]] = list[keys[key]];
			// 			}
			// 		}else{
			// 			returnArray["key_"+key] = keys[key];
			// 		}
			// 	}
			// 	this.fields = returnArray;
			// }

			this.owner.processfields(this.fields, this.self, this);
		}
	},
	isContainer: true
});