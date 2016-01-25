(function(b, $){
	b.register({ type: 'dropdown',
		create: function() {
			// return f.render('berry_dropdown', f.processOpts(this.item));
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			return b.render('berry_' + (this.elType || this.type), this);

		},
		setup: function() {
			this.$el = this.self.find('.btn-group');
			this.$el.find('a').on('click',$.proxy(function(e){
				e.preventDefault();
				this.setValue($(e.target).data('value'));
				this.trigger('change');
				if(this.onchange !== undefined){
					this.onchange();
				}
			}, this));
		},
		setValue: function(value) {
			this.$el.find('ul').attr('data-value',value);
			return this.$el.find('button').html(this.displayAs(value) + ' <span class="caret"></span>');
		},
		getValue: function() {
			return this.$el.find('ul').attr('data-value');
		},
		displayAs: function(value) {
			for(var i in this.options) {
				if(this.options[i].value == (value || this.value)) {
					return this.options[i].label;
				}
			}
		}
	});
})(Berry,jQuery);