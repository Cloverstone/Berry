(function(b, $){
	b.register({ type: 'select',
		// value: '',
		create: function() {
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			return b.render('berry_' + (this.elType || this.type), this);
		},
		setup: function() {
			this.$el = this.self.find('select');
			this.$el.off();
			this.setValue(this.value);
			if(this.onchange !== undefined){
				this.on('change', this.onchange);
			}
			this.$el.change($.proxy(function(){this.trigger('change');}, this));
		},
		displayAs: function() {
			var o = this.options;
			for(var i in o) {
				if(o[i].value == this.lastSaved) {
					return o[i].label;
				}
			}
		},		
		getValue: function() {
			if(this.item.waiting){
				return this.value;
			}
		 return this.$el.val(); 
		},
		setValue: function(value){
			if(typeof value !== 'object' && this.item.waiting || (typeof _.findWhere(this.options, {value:  value}) !== 'undefined' || typeof _.findWhere(this.options, {value:  value+=''}) !== 'undefined' || typeof _.findWhere(this.options, {value:  parseInt(value, 10)}) !== 'undefined') ){
				if(typeof this.lastSaved === 'undefined'){
					this.lastSaved = value;
				}
				this.value = value;
				this.$el.val(value);
			}
			return this.value;
		}
	});
})(Berry, jQuery);