(function(b, $){
	b.register({
		type: 'textarea',
		default: {autosize: true, advanced: false},
		setup: function() {
			this.$el = this.self.find('textarea');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			this.$el.on('input', $.proxy(function(){this.trigger('change');},this));

			if(this.item.advanced && $.fn.htmlarea){
				this.$el.css({height: '300px'}).htmlarea({
					toolbar: (this.item.toolbar || [
						//['html'],
						['bold', 'italic', 'underline'],
						['superscript', 'subscript'],
						['justifyleft', 'justifycenter', 'justifyright'],
						['indent', 'outdent'],
						['orderedList', 'unorderedList'],
						['link', 'unlink'],
						['horizontalrule']
					])
				});
				this.$el.on('change', $.proxy(function(){this.trigger('change');},this));
			}
			if((this.autosize !== false) && $.fn.autosize){
				this.$el.autosize();
			}
		},
		setValue: function(value){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.value = value;
			this.$el.val(value)

			if((this.autosize !== false) && $.fn.autosize){
				this.$el.trigger('autosize.resize');
			}
			if(this.item.advanced && $.fn.htmlarea){
				this.$el.htmlarea('updateHtmlArea', value);
			}
			return this.$el;
		},
		focus: function(){
			this.$el.focus().val('').val(this.value);
			this.self.find('iframe').focus();
		}
	});
})(Berry,jQuery);