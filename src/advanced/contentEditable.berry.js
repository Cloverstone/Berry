(function(b, $){

// 	var oldEditor = $.summernote.options.modules.editor;
// $.summernote.options.modules.editor = function() {
//     oldEditor.apply(this, arguments);
//     var oldCreateRange = this.createRange;
//     var oldFocus = this.focus;

//     this.createRange = function () {
//         this.focus = function() {};
//         var result = oldCreateRange.apply(this, arguments);
//         this.focus = oldFocus;
//         return result;
//     };
// };

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
			// this.$el.on('input', $.proxy(function(){this.trigger('change');},this));
			this.$el.summernote({
				disableDragAndDrop: true,
		    dialogsInBody: true,
				toolbar: [
					// [groupName, [list of button]]
					['style', ['bold', 'italic', 'underline', 'clear']],
			    ['link', ['linkDialogShow', 'unlink']],
					['font', ['strikethrough', 'superscript', 'subscript']],
					['fontsize', ['fontsize']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['height', ['height']],
					['view', ['fullscreen']]
				]
			});
			this.$el.on('summernote.change', $.proxy(function(){this.trigger('change');},this));

// this.$el.on('summernote.blur', $.proxy(function() {
//   this.$el.summernote('saveRange');
// },this));

// this.$el.on('summernote.focus', $.proxy(function() {
//   this.$el.summernote('restoreRange');
// },this));

		 //  this.editor = new Pen({
		 //  	editor: this.$el[0], // {DOM Element} [required]
		 //  	//textarea: '<textarea name="content"></textarea>', // fallback for old browsers
		 //  	//list: ['bold', 'italic', 'underline'] // editor menu list
			// });

			// tinymce.init({
			//   selector: '.formcontrol > div',  // change this value according to your HTML
			//   plugins: ['autolink link code image'],      
			//   inline: true,
			//   toolbar1: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
			// });

			// this.editor = tinyMCE.editors[tinyMCE.editors.length-1];
		},
		setValue: function(value){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			// this.editor.setContent(value)
			this.$el.summernote('code', value)
			this.value = value;
			// this.$el.html(value)

			return this.$el;
		},
		getValue: function(){
			return this.$el.summernote('code')
			// return this.editor.getContent()
			// return this.$el.html();
		},satisfied: function(){
			this.value = this.getValue()
			return (typeof this.value !== 'undefined' && this.value !== null && this.value !== '' && this.value !== "<p><br></p>");
		},	destroy: function() {
		this.$el.summernote('destroy');
		if(this.$el){
			this.$el.off();
		}
 }
		// destroy: function(){
		// 	this.editor.destroy();
		// }
		// focus: function(){
		// 	this.$el.focus().val('').val(this.value);
		// 	this.self.find('iframe').focus();
		// }
	});
})(Berry,jQuery);
$(document).on('focusin', function(e) {
    if ($(e.target).closest(".note-editable").length) {
        e.stopImmediatePropagation();
			
    }
});
$(document).on('click', function(e) {
    if ($(e.target).hasClass(".note-editor")) {
        e.stopImmediatePropagation();

			$(e.target).find('.open').removeClass('open')
    }
});
