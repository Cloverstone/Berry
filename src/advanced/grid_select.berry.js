(function(b, $){
	b.register({ type: 'grid_select',
		defaults: {select_class: "text-info",},
		create: function() {
			//return f.render('berry_grid_select', f.processOpts(this.item));
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			// if(this.value_key){
				for(var i in this.options){
					this.options[i].image = this.options[i][(this.value_key || 'value')];
				// }
			}
			return b.render('berry_' + (this.elType || this.type), this);
		},
		setup: function() {
			this.$el = this.self.find('.list');
			this.$el.children('.col-md-3').off();
			this.$el.children('.col-md-3').on('click', $.proxy(function(e){
				this.$el.children('.'+this.select_class).removeClass(this.select_class);
				$(e.target).closest('.col-md-3').addClass(this.select_class);

				if(typeof this.onchange === 'function'){
					this.onchange();
				}
				this.trigger('change');
			}, this));
		},
		getValue: function() {
			return this.$el.children('.'+this.select_class).attr('data-value');
		},
		setValue: function(val) {
			return this.$el.children('[data-value="'+val+'"]').click();
		},

	});
})(Berry,jQuery);