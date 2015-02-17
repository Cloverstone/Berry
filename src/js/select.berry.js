(function(b,$){
	b.register({ type: 'select',
		create: function() {
			return b.render('berry_select', b.processOpts(this));
		},
		setup: function() {
			this.$el = this.self.find('select');
			if(this.onchange !== undefined){
				this.$el.change(this.onchange);
			}
			this.$el.change($.proxy(function(){this.trigger('change');}, this));
		},
		// getValue: function() {
		// 	return this.$el.children('option:selected').attr('value');
		// },
		displayAs: function() {
			var o = this.options;
			for(var i in o) {
				if(o[i].value == this.lastSaved) {
					return o[i].label;
				}
			}
		}
	});
})(Berry,jQuery);