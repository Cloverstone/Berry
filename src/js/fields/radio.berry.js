(function(b, $){
	b.register({ type: 'radio',
		create: function() {
			// this.options = b.processOpts.call(this.owner, this.item).options;
			// return b.render('berry_radio', this);
			this.options = f.processOpts.call(this.owner, this.item, this).options;
			return f.render('berry_' + (this.elType || this.type), this);
		},
		setup: function() {
			this.$el = this.self.find('[type=radio]');
			if(this.onchange !== undefined) {
	//			this.$el.change(this.onchange);
				this.on('change', this.onchange);
			}
			this.$el.change($.proxy(function(){this.trigger('change');}, this));
		},
		getValue: function() {
			var selected = this.self.find('[type="radio"]:checked').data('label');
			for(var i in this.item.options) {
				if(this.item.options[i].label == selected) {
					return this.item.options[i].value;
				}
			}
		},
		setValue: function(value) {
			this.value = value;
			this.self.find('[value="' + this.value + '"]').prop('checked', true);
		},
		displayAs: function() {
			for(var i in this.item.options) {
				if(this.item.options[i].value == this.lastSaved) {
					return this.item.options[i].label;
				}
			}
		},
		focus: function(){
			this.self.find('[type="radio"]:checked').focus();
		}
	});
})(Berry, jQuery);