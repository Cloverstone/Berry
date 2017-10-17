(function(b, $){
	b.register({
		type: 'base64',
		defaults: { elType: 'file' },
		create: function() {
			return b.render('berry_text', this);
		},
		// defaults: {autosize: true, advanced: false},
		setup: function() {
			this.$el = this.self.find('input');
			this.$el.off();
			this.$el.on('change', _.partial(function (field, e) {
				var files = this.files
		    // Check for the various File API support.
		    if (window.FileReader) {
		        // FileReader are supported.
		      (function (fileToRead, field) {
			      var reader = new FileReader();
			      // Read file into memory as UTF-8      
			      reader.readAsDataURL(fileToRead);
			      reader.onload = function (event) {
			      	// event.target.result;
				    	this.set(event.target.result);//.split(',').pop());

				    }.bind(field)
			      reader.onerror = function (evt) {
				      if(evt.target.error.name == "NotReadableError") {
				          alert("Canno't read file !");
				      }
				    }
			    })(files[0],field);
			    e.currentTarget.value = '';

		    } else {
		        alert('FileReader is not supported in this browser.');
		    }
		  }, this));
		},	
		setValue: function(value) {
			if(typeof value !== 'object'){
				if(typeof this.lastSaved === 'undefined'){
					this.lastSaved = value;
				}
				this.value = value;
				return this.value;
			}
			return this.value;
		},	
		getValue: function() { return this.value; }
	});
})(Berry,jQuery);
