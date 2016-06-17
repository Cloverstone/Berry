Berry.extract = true;
Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		if(typeof this.options.template !== 'undefined'){
			
			var myRegexp = /\{\{\{?(.[\s\S]*?)\}\}\}?/g;
			text = this.options.template;
			var tempdiv = text;
			var match = myRegexp.exec(text);
			this.options.fields = this.options.fields || {};
			while (match != null) {
				//split into the constituent parts
				var splits = match[1].split(':{');

				var pre = '{{';
				//if this is a comment we still want to process it and return it to its status as a comment
				if(splits[0].substr(0,1) == '!'){splits[0] = splits[0].substr(1);pre += '!';}

				//ignore advanced types in the mustache
				if($.inArray( splits[0].substr(0,1) , [ "^", "#", "/", ">" ] ) < 0  ){
					var cobj = {};

					//identify if there is more info about this field, if so map it to an object
					if(splits.length>1){cobj = JSON.parse('{'+splits[1] )}

					//update the fields array with the the values
					this.options.fields[splits[0]] = $.extend(this.options.fields[splits[0]], cobj);

					//replace with the mustache equivilent with the key
					tempdiv = tempdiv.replace(match[0], pre+(this.options.fields[splits[0]].name || splits[0].toLowerCase().split(' ').join('_'))+"}}");
				}

				//check if there is more
				match = myRegexp.exec(text);
			}
			this.options.template = Hogan.compile(tempdiv);
		}
	}
});