Berry.prototype.valid = true;
Berry.prototype.validate = function(){
	this.toJSON();
	this.clearErrors();
	this.each(this.validateItem);
	return this.valid;
};
Berry.prototype.validateItem = function(){
	this.owner.performValidate(this);
	this.owner.errors[this.item.name] = this.errors;
	if(this.owner.valid !== false){
		this.owner.valid = this.valid;
	}
};
Berry.prototype.performValidate = function(processee,processValue){
	var item = processee.item;
	var value = processee.value;
	if(typeof processValue !== 'undefined'){value = processValue;}
	processee.valid = true;
	processee.errors = '';

	if(typeof item.validate !== 'undefined' && typeof item.validate === 'object'){
		for(var r in item.validate){
			if(!Berry.validations[r].method(value,item.validate[r])){
				// if((typeof item.show === 'undefined') || processee.owner.show(item.show)){
				if((typeof item.show === 'undefined') || processee.owner.isVisible){

					


					processee.valid = false;
					var errorstring = Berry.validations[r].message;
					if(typeof item.validate[r] == 'string') {
						errorstring = item.validate[r];
					}
					processee.errors = errorstring.replace('{{label}}',item.label);
				}
			}
			processee.self.toggleClass(processee.owner.options.errorClass, !processee.valid);
			processee.self.find('.' + processee.owner.options.errorTextClass).html(processee.errors);
		}
	}
};
Berry.prototype.errors = {};
Berry.prototype.clearErrors = function() {
	this.valid = true;
	this.errors = {};
	this.$el.find("." + this.options.errorClass).removeClass(this.options.errorClass).find("." + this.options.errorTextClass).html("");
};
//var ruleRegex = /^(.+)\[(.+)\]$/,
Berry.regex = {};
Berry.regex.numeric = /^[0-9]+$/;
Berry.regex.integer = /^\-?[0-9]+$/;
Berry.regex.decimal = /^\-?[0-9]*\.?[0-9]+$/;
Berry.regex.email = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i;
Berry.regex.alpha = /^[a-z]+$/i;
Berry.regex.alphaNumeric = /^[a-z0-9]+$/i;
Berry.regex.alphaDash = /^[a-z0-9_-]+$/i;
Berry.regex.natural = /^[0-9]+$/i;
Berry.regex.naturalNoZero = /^[1-9][0-9]*$/i;
Berry.regex.ip = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i;
Berry.regex.base64 = /[^a-zA-Z0-9\/\+=]/i;
Berry.regex.url = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
Berry.validations = {
	required:{
		method: function(value, args) {
//      var value = field.value;
//      if (field.type === 'checkbox') {
//          return (field.checked === true);
//      }
			return (value !== null && value !== '');
		},
		message: 'The {{label}} field is required.'
	},
	matches:{
		method: function(value, matchName) {
			if (el == this.Berry[matchName]) {
				return value === el.value;
			}
			return false;
		},
		message: 'The {{label}} field does not match the %s field.'
	},
	valid_email:{
		method: function(value) {
			return (Berry.regex.email.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a valid email address.'
	},
	valid_emails:{
		method: function(value) {
			var result = value.split(",");
			for (var i = 0; i < result.length; i++) {
				if (!Berry.regex.email.test(result[i])) {
					return false;
				}
			}
			return true;
		},
		message: 'The {{label}} field must contain all valid email addresses.'
	},
	min_length:{
		method: function(value, length) {
			if (!Berry.regex.numeric.test(length)) {
				return false;
			}
			return (value.length >= parseInt(length, 10));
		},
		message: 'The {{label}} field must be at least %s characters in length.'
	},
	max_length:{
		method: function(value, length) {
			if (!Berry.regex.numeric.test(length)) {
				return false;
			}
			return (value.length <= parseInt(length, 10));
		},
		message: 'The {{label}} field must not exceed %s characters in length.'
	},
	exact_length:{
		method: function(value, length) {
			if (!Berry.regex.numericBerry.test(length)) {
				return false;
			}
			return (value.length === parseInt(length, 10));
		},
		message: 'The {{label}} field must be exactly %s characters in length.'
	},
	greater_than:{
		method: function(value, param) {
			if (!decimalRegex.test(value)) {
				return false;
			}
			return (parseFloat(value) > parseFloat(param));
		},
		message: 'The {{label}} field must contain a number greater than %s.'
	},
	less_than:{
		method: function(value, param) {
			if (!decimalRegex.test(value)) {
				return false;
			}
			return (parseFloat(value) < parseFloat(param));
		},
		message: 'The {{label}} field must contain a number less than %s.'
	},
	alpha:{
		method: function(value) {
			return (alphaRegex.test(value) || value === '');
		},
		message: 'The {{label}} field must only contain alphabetical characters.'
	},
	alpha_numeric:{
		method: function(value) {
			return (alphaNumericRegex.test(value) || value === '');
		},
		message: 'The {{label}} field must only contain alpha-numeric characters.'
	},
	alpha_dash:{
		method: function(value) {
			return (alphaDashRegex.test(value) || value === '');
		},
		message: 'The {{label}} field must only contain alpha-numeric characters, underscores, and dashes.'
	},
	numeric:{
		method: function(value) {
			return (decimalRegex.test(value) || value === '');
		},
		message: 'The {{label}} field must contain only numbers.'
	},
	integer:{
		method: function(value) {
			return (Berry.regex.integer.test(value) || value === '');
		},
		message: 'The {{label}} field must contain an integer.'
	},
	decimal:{
		method: function(value) {
			return (decimalRegex.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a decimal number.'
	},
	is_natural:{
		method: function(value) {
			return (naturalRegex.test(value) || value === '');
		},
		message: 'The {{label}} field must contain only positive numbers.'
	},
	is_natural_no_zero:{
		method: function(value) {
			return (naturalNoZeroRegex.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a number greater than zero.'
	},
	valid_ip:{
		method: function(value) {
			return (ipRegex.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a valid IP.'
	},
	valid_url:{
		method: function(value) {
			return (urlRegex.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a valid Url.'
	},
	valid_base64:{
		method: function(value) {
			return (base64Regex.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a base64 string.'
	}
};