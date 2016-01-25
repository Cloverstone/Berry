(function(b, $){
	b.register({ type: 'rateit',
		create: function() {
			return b.render('berry_rateit', this);
		},
		setup: function() {
			this.render();
			this.$el = this.self.find('.rateit');
			this.$el.rateit();
			this.$el.rateit('value', this.value);
			this.$el.bind('rated reset', $.proxy(function (e) {
				this.$el.focus();
				this.trigger('change');
				if(this.onchange !== undefined){
					this.onchange();
				}
			},this));
		},
		setValue: function(value) {
			this.value = value;
			return this.$el.rateit('value', value);
		},
		getValue: function() {
			return this.$el.rateit('value');
		},
		getDisplay: function() {
			for(var i in this.options) {
				if(this.options[i].value == this.lastSaved) {
					return this.options[i].label;
				}
			}
			var rstring = "";
			for(var i = 1; i<= this.value; i++){
				rstring += '<i class="fa fa-star"></i>';
			}
			var temp = Math.floor(this.value);
			if(this.value - temp >= 0.5){
				rstring += '<i class="fa fa-star-half-full"></i>';
			}
			for(var i = Math.round(this.value); i< 5; i++){
				rstring += '<i class="fa fa-star-o"></i>';
			}
			return rstring;
		}
	});
})(Berry,jQuery);