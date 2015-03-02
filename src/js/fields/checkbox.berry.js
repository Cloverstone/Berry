(function(f,$){
	f.register({ type: 'checkbox',
		create: function() {
			this.checkStatus(this.value);
			return f.render('berry_checkbox', this);
		},
		checkStatus: function(value){
			if(value === true || value === "true" || value === 1 || value === "1" || value === "on" || value == this.truestate){
				this.value = true;
			}else{
				this.value = false;
			}
		},
		setup: function() {
			this.$el = this.self.find('[type=checkbox]');
			if(this.onchange !== undefined) {
				this.$el.change(this.onchange);
			}
			this.$el.change($.proxy(function(){this.trigger('change');},this));
		},
		getValue: function() {
			if(this.$el.is(':checked')){
				return this.truestate || true
			}else{
				return this.falsestate || false;
			};
		},
		setValue: function(value) {
			this.checkStatus(value);
			this.$el.prop('checked', this.value);
			this.value = value;
		},
		displayAs: function() {
			for(var i in this.item.options) {
				if(this.item.options[i].value == this.lastSaved) {
					return this.item.options[i].name;
				}
			}
		},
		focus: function(){
			this.$el.focus();
		}
	});
})(Berry, jQuery);