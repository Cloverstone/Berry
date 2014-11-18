(function(f,$){
	f.register({ type: 'custom_radio',
		create: function() {
			return f.render('berry_custom_radio', f.processOpts(this));
		},
		setup: function() {
			this.$el = this.self.find('.custom-group');
			this.$el.children('.btn').off();
			this.$el.children('.btn').on('click', $.proxy(function(e){
				this.$el.children('.btn-success').toggleClass('btn-success btn-default');
				$(e.target).closest('.btn').toggleClass('btn-success btn-default');
				if(typeof this.onchange === 'function'){
					this.onchange();
				}
				this.trigger('change');
			}, this));
		},
		getValue: function() {
			return this.$el.children('.btn-success').attr('data-value');
		},
		setValue: function(val) {
			return this.$el.children('[data-value="'+val+'"]').click();
		},

	});
})(Berry,jQuery);