(function(b, $){
	b.register({
		type: 'upload',
		defaults: {autosize: true, advanced: false},
		setup: function() {
			this.$el = this.self.find('form input');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			this.$el.on('input', $.proxy(function(){this.trigger('change');},this));
			this.myDropzone = new Dropzone('#' + this.name, { method: 'post', paramName: this.name, success: $.proxy(function(message,response){
				//contentManager.currentView.model.set(this.name, response[this.name]);
				//myDropzone.removeAllFiles();

				//this.setValue(response[this.name]);
				this.setValue(response);
				this.trigger('uploaded');
			}, this)});
			// myDropzone.on("complete", function(file) {
			// 	myDropzone.removeFile(file);
			// });
		},
		getValue: function() {
		 return this.value; 
		},
		setValue: function(value){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.value = value;
			return this.$el;
		},
		update: function(item, silent) {
			if(typeof item === 'object') {
				$.extend(this.item, item);
			}
			$.extend(this, this.item);
			this.setValue(this.value);
			this.myDropzone.destroy();
			this.render();
			this.setup();
			if(!silent) {
				this.trigger('change');
			}
		},
		render: function() {
			if(typeof this.self === 'undefined') {
				this.self = $(this.create()).attr('data-Berry', this.owner.options.name);
			} else {
				this.self.find('div:first').replaceWith($(this.create()).html())
			}
			this.display = this.getDisplay();
			return this.self;
		}
	});
})(Berry,jQuery);