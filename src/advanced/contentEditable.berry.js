(function(b, $){
	b.register({
		type: 'contenteditable',
		create: function() {
				return b.render('berry_contenteditable', this);
			},
		setup: function() {
			this.$el = this.self.find('.formcontrol > div');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			this.$el.on('input', $.proxy(function(){this.trigger('change');},this));

		 //  this.editor = new Pen({
		 //  	editor: this.$el[0], // {DOM Element} [required]
		 //  	//textarea: '<textarea name="content"></textarea>', // fallback for old browsers
		 //  	//list: ['bold', 'italic', 'underline'] // editor menu list
			// });

			tinymce.init({
			  selector: '.formcontrol > div',  // change this value according to your HTML
			  plugins: ['autolink link code image'],      
			  inline: true,
			  toolbar1: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
			});

			this.editor = tinyMCE.editors[tinyMCE.editors.length-1];
		},
		setValue: function(value){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.editor.setContent(value)
			this.value = value;
			this.$el.html(value)

			return this.$el;
		},
		getValue: function(){
			return this.editor.getContent()
			// return this.$el.html();
		},
		// destroy: function(){
		// 	this.editor.destroy();
		// }
		// focus: function(){
		// 	this.$el.focus().val('').val(this.value);
		// 	this.self.find('iframe').focus();
		// }
	});
})(Berry,jQuery);