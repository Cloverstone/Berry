Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		Berry.field.prototype.dupeMe = function(options) {
			var target = this.self;
			var max = this.multiple.max || -1;
			// var count = $(target).siblings('[name=' + this.name + ']').length + 1;
			 var count = this.parent.children[this.name].instances.length;
			if(max == -1 || max > count){
				var item = $.extend({}, this.owner.options.default, this.item, {id: Berry.getUID(), name: this.name});
				this.owner.processField(
					$.extend({}, this.owner.options.default, this.item, {id: Berry.getUID(), name: this.name}),
					$(target), this.parent, 'after');
				this.trigger('change');
			}
		}

		Berry.field.prototype.dropMe = function() {
			var target = this.self;
			var min = this.multiple.min || 1;
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

		this.on('dropped', function(info){
			var temp = this.findByID(info.id);
			var target = this.fields;
			if(temp.isChild()){
				target = temp.parent.children;
			}
			target[temp.name].instances.splice(temp.instance_id, 1);
		}, this);

		this.on('initializedField', function(opts){
			if(opts.field.multiple && opts.field.multiple.duplicate) {
				opts.field.self.find('.duplicate').on('click', $.proxy(opts.field.dupeMe, opts.field) );
				opts.field.self.find('.remove').on('click', $.proxy(opts.field.dropMe, opts.field) );
			}
		});
	}
});
