(function(b, $){
	b.register({
		type: 'file',
		defaults: {autosize: true, advanced: false, elType: 'text' },
		setup: function() {
			this.$el = this.self.find('form input');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('change', this.onchange);
			}
			this.$el.on('change', $.proxy(function(){this.trigger('change');},this));
				// myDropzone = new Dropzone('#' + this.name, { method: 'post', paramName: this.name, success: $.proxy(function(message,response){
				// 	//contentManager.currentView.model.set(this.name, response[this.name]);
				// 	//myDropzone.removeAllFiles();

				// 	//this.setValue(response[this.name]);
				// 	this.setValue(response);
				// 	this.trigger('change');
				// }, this)});
				// // myDropzone.on("complete", function(file) {
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
		}
	});
})(Berry,jQuery);