(function(b, $){
	b.register({ type: 'select',
		create: function() {
			// this.options = b.processOpts.call(this.owner, this.item).options;
			// return b.render('berry_' + (this.elType || this.type), this);
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			return b.render('berry_' + (this.elType || this.type), this);
		},
		setup: function() {
			this.$el = this.self.find('select');
			if(this.onchange !== undefined){
	//			this.$el.change(this.onchange);
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
		}
	});
})(Berry, jQuery);