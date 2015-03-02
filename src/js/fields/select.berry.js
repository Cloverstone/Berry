(function(b, $){
	b.register({ type: 'select',
		create: function() {
			return b.render('berry_' + (this.elType || this.type), b.processOpts(this.item));
		},
		setup: function() {
			this.$el = this.self.find('select');
			if(this.onchange !== undefined){
				this.$el.change(this.onchange);
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
		}
	});
})(Berry, jQuery);