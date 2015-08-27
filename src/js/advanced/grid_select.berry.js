(function(b, $){
	b.register({ type: 'grid_select',
		create: function() {
			//return f.render('berry_grid_select', f.processOpts(this.item));
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			if(this.reference){
				for(var i in this.options){
					this.options[i].image = this.options[i][this.reference];
				}
			}
			return b.render('berry_' + (this.elType || this.type), this);
		},
		setup: function() {
			this.$el = this.self.find('.list');
			this.$el.children('.col-md-3').off();
			this.$el.children('.col-md-3').on('click', $.proxy(function(e){
				
				this.$el.children('.text-success').removeClass('text-success');
				$(e.target).closest('.col-md-3').addClass('text-success');

				if(typeof this.onchange === 'function'){
					this.onchange();
				}
				this.trigger('change');
			}, this));
		},
		getValue: function() {
			return this.$el.children('.text-success').attr('data-value');
		},
		setValue: function(val) {
			return this.$el.children('[data-value="'+val+'"]').click();
		},

	});
})(Berry,jQuery);