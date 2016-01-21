Berry.extract = true;
Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		if(typeof this.options.template !== 'undefined'){
			
			var myRegexp = /\{\{(.[\s\S]*?)\}\}/g;
			text = this.options.template;
			var tempdiv = text;
			var match = myRegexp.exec(text);
			// var form = {};

			while (match != null) {
				var splits = match[1].split(':{');
				var pre = '';
				if(splits[0].substr(0,1) == '!'){splits[0] = splits[0].substr(1);pre = '!';}
				if($.inArray( splits[0].substr(0,1) , [ "^", "#", "/", ">" ] ) < 0  ){
					var cobj = {};
					if(splits.length>1){cobj = JSON.parse('{'+splits[1] )}


					this.options.fields[splits[0]] = $.extend(this.options.fields[splits[0]], cobj);
					tempdiv = tempdiv.replace(match[0], "{{"+pre+splits[0].toLowerCase().split(' ').join('_')+"}}");
				}
				match = myRegexp.exec(text);
			}

			this.options.template = Hogan.compile(tempdiv);
		}
	}
});