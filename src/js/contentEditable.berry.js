Berry.register({
	type: 'contenteditable',
	create: function() {
			return Berry.render('berry_contenteditable', this);
		},
	setup: function() {
		this.$el = this.self.find('.formcontrol > div');
		this.$el.off();
		if(this.onchange !== undefined) {
			this.$el.on('input', this.onchange);
		}
		this.$el.on('input', $.proxy(function(){this.trigger('change');},this));

//    grande.bind(this.$el);
	// 	this.editor = new Pen(this.$el[0]);
 // list: ['bold', 'italic', 'underline'] // editor menu list

	  this.editor = new Pen({
	  	editor: this.$el[0], // {DOM Element} [required]
	  	//textarea: '<textarea name="content"></textarea>', // fallback for old browsers
	  	list: ['bold', 'italic', 'underline'] // editor menu list
		});

//var editor = new Pen(options);
	},
	setValue: function(value){
		if(typeof this.lastSaved === 'undefined'){
			this.lastSaved = value;
		}
		this.value = value;
		this.$el.html(value)

		return this.$el;
	},
	getValue: function(){
		return this.$el.html();
	},
	// destroy: function(){
	// 	this.editor.destroy();
	// }
	// focus: function(){
	// 	this.$el.focus().val('').val(this.value);
	// 	this.self.find('iframe').focus();
	// }
});