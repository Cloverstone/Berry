(function(b, $){
	b.register({ type: 'custom_radio',
		create: function() {
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			return b.render('berry_' + (this.elType || this.type), this);
		},
		defaults: {
			selectedClass: 'btn-success',
			defaultClass: 'btn-default',
		},
		setup: function() {
			this.$el = this.self.find('.custom-group');
			this.$el.children('.btn').off();
			this.$el.children('.btn').on('click', $.proxy(function(e){
				this.$el.children('.' + this.selectedClass).toggleClass(this.selectedClass + ' ' + this.defaultClass);
				$(e.target).closest('.btn').toggleClass(this.selectedClass + ' ' + this.defaultClass);
				if(typeof this.onchange === 'function'){
					this.onchange();
				}
				this.trigger('change');
			}, this));
		},
		getValue: function() {
			return this.$el.children('.' + this.selectedClass).attr('data-value');
		},
		setValue: function(val) {
			return this.$el.children('[data-value="'+val+'"]').click();
		},

	});
})(Berry,jQuery);