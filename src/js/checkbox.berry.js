(function(f,$){
	f.register({ type: 'checkbox',
		create: function() {
			this.checkStatus(this.value);
			return f.render('berry_checkbox',this);
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
			return this.self.find('[type="checkbox"]').is(':checked');
		},
		setValue: function(value) {
			this.checkStatus(value);
			this.self.find('[name="'+this.name+'"]').prop('checked', this.value);
		},
		displayAs: function() {
			for(var i in this.item.options) {
				if(this.item.options[i].value == this.lastSaved) {
					return this.item.options[i].name;
				}
			}
		},
		focus: function(){
			this.self.find('[type="checkbox"]:checked').focus();
		}
	});
})(Berry, jQuery);