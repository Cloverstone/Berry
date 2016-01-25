(function(b, $){
	b.register({
		type: 'ace',
		create: function() {
				return b.render('berry_ace', this);
			},
		setup: function() {
			this.$el = this.self.find('.formcontrol > div');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			this.$el.on('input', $.proxy(function(){this.trigger('change');},this));

			this.editor = ace.edit(this.name+"container");
	    this.editor.setTheme(this.item.them || "ace/theme/chrome");
	    this.editor.getSession().setMode(this.item.mode || "ace/mode/handlebars");

		},
		setValue: function(value){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.value = value;
			this.editor.setValue(value);
			return this.$el;
		},
		getValue: function(){
			return this.editor.getValue()
		},
		// destroy: function(){
		// 	this.editor.destroy();
		// }
		focus: function(){
			this.editor.focus();
		}
	});
})(Berry,jQuery);