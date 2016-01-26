Berry.renderers['inline'] = function(owner) {
	this.owner = owner;
	// this.selector = 
	this.fieldset = function(data) {
		Berry.render('berry_base_fieldset', data);
	};
	this.render = function() {
		return $('<div/>');
	};

};

Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function(){
		if(this.options.renderer == 'inline'){
			this.options.inline = true;
			this.options.autoFocus = false;
			this.options.default = {hideLabel: true,};
			this.on('initializeField', function(opts){
					opts.field.item.fieldset = this.$el.find('[data-inline="'+opts.field.item.name+'"]');
					if(opts.field.item.fieldset){$.extend(opts.field.item, opts.field.item.fieldset.data());}
//					return temp;
				});
			//  fieldset: function(){
			// 	// debugger;
			// 		var temp = this.owner.$el.find('[data-inline='+this.item.name+']');
			// 		if(temp){$.extend(this.item, temp.data());}
			// 		return temp;
			// 	}
			// };
		}
	}
});
