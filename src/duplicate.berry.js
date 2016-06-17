Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		Berry.field.prototype.clone = function(options) {
			// var target = this.self;
			var max = this.multiple.max;
			if(typeof max === 'undefined' || max > this.parent.children[this.name].instances.length){
				var item = $.extend({}, this.owner.options.default, this.item, {id: Berry.getUID(), name: this.name});
				this.owner.createField(
					$.extend({}, this.owner.options.default, this.item, {id: Berry.getUID(), name: this.name}),
					$(this.self), this.parent, 'after');
				this.trigger('change');
				return true;
			}
			return false;
		}

		Berry.field.prototype.remove = function() {
			if((this.multiple.min || 1) < this.owner.find(this.getPath()).length){
				$(this.self).empty().remove();
				this.trigger('dropped');

				var fields = this.owner.fields;
				if(this.isChild()){
					fields = this.parent.children;
				}
				fields[this.name].instances.splice(this.instance_id, 1);

				var index=0;
				var instances = this.owner.find(this.getPath());
				for(var j in instances){
					instances[j].instance_id = index++;
				}

				this.trigger('change');
				return true;
			}
			return false;
		}

		// this.on('dropped', function(info){
		// 	var temp = this.findByID(info.id);
		// 	var target = this.fields;
		// 	if(temp.isChild()){
		// 		target = temp.parent.children;
		// 	}
		// 	target[temp.name].instances.splice(temp.instance_id, 1);
		// }, this);

		this.on('initializedField', function(opts){
			if(opts.field.multiple && opts.field.multiple.duplicate) {
				opts.field.self.find('.duplicate').on('click', $.proxy(opts.field.clone, opts.field) );
				opts.field.self.find('.remove').on('click', $.proxy(opts.field.remove, opts.field) );
			}
		});
	}
});
