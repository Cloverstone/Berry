(function(f,$){
	f.register({ type: 'custom_select',
		create: function() {
			return f.render('berry_custom_select', f.processOpts(this.item));
		},
		setup: function() {
			this.$el = this.self.find('.list-group');
			this.$el.children('.list-group-item').off();
			this.$el.children('.list-group-item').on('click', $.proxy(function(e){
				this.$el.children('.list-group-item-success').removeClass('list-group-item-success');
				$(e.target).closest('.list-group-item').addClass('list-group-item-success');
				if(typeof this.onchange === 'function'){
					this.onchange();
				}
				this.trigger('change');
			}, this));
		},
		getValue: function() {
			return this.$el.children('.list-group-item-success').attr('data-value');
		},
		setValue: function(val) {
			return this.$el.children('[data-value="'+val+'"]').click();
		},

	});
})(Berry,jQuery);