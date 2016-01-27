

Berry.prototype.valid = true;
Berry.prototype.validate = function(processed){
	if(!processed) {
		this.toJSON();
	}
	//this.parsefields(this.options);
	this.clearErrors();
	this.each(this.validateItem);
	return this.valid;
};
Berry.prototype.validateItem = function(){
	this.owner.performValidate(this);
	this.owner.errors[this.item.name] = this.errors;
	this.owner.valid = this.valid && this.owner.valid;
};
Berry.prototype.performValidate = function(target, pValue){
	var item = target.item;
	var value = target.value;
	if(typeof pValue !== 'undefined'){value = pValue;}
	target.valid = true;
	target.errors = '';

	if(typeof item.validate !== 'undefined' && typeof item.validate === 'object'){
		for(var r in item.validate){
			if(!Berry.validations[r].method.call(target, value, item.validate[r])){
				if((typeof item.show === 'undefined') || target.owner.isVisible){
					target.valid = false;
					var estring = Berry.validations[r].message;
					if(typeof item.validate[r] == 'string') {
						estring = item.validate[r];
					}
					target.errors = estring.replace('{{label}}', item.label);
				}
			}
			target.self.toggleClass(target.owner.options.errorClass, !target.valid);
			target.self.find('.' + target.owner.options.errorTextClass).html(target.errors);
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
			return this.satisfied();
			// return (value !== null && value !== '');
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
			if (!Berry.regex.numeric.test(length)) {
				return false;
			}
			return (value.length === parseInt(length, 10));
		},
		message: 'The {{label}} field must be exactly %s characters in length.'
	},
	greater_than:{
		method: function(value, param) {
			if (!Berry.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) > parseFloat(param));
		},
		message: 'The {{label}} field must contain a number greater than %s.'
	},
	less_than:{
		method: function(value, param) {
			if (!Berry.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) < parseFloat(param));
		},
		message: 'The {{label}} field must contain a number less than %s.'
	},
	alpha:{
		method: function(value) {
			return (Berry.regex.alpha.test(value) || value === '');
		},
		message: 'The {{label}} field must only contain alphabetical characters.'
	},
	alpha_numeric:{
		method: function(value) {
			return (Berry.regex.alphaNumeric.test(value) || value === '');
		},
		message: 'The {{label}} field must only contain alpha-numeric characters.'
	},
	alpha_dash:{
		method: function(value) {
			return (Berry.regex.alphaDash.test(value) || value === '');
		},
		message: 'The {{label}} field must only contain alpha-numeric characters, underscores, and dashes.'
	},
	numeric:{
		method: function(value) {
			return (Berry.regex.decimal.test(value) || value === '');
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
			return (Berry.regex.decimal.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a decimal number.'
	},
	is_natural:{
		method: function(value) {
			return (Berry.regex.natural.test(value) || value === '');
		},
		message: 'The {{label}} field must contain only positive numbers.'
	},
	is_natural_no_zero:{
		method: function(value) {
			return (Berry.regex.naturalNoZero.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a number greater than zero.'
	},
	valid_ip:{
		method: function(value) {
			return (Berry.regex.ip.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a valid IP.'
	},
	valid_url:{
		method: function(value) {
			return (Berry.regex.url.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a valid Url.'
	},
	valid_base64:{
		method: function(value) {
			return (Berry.regex.base64.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a base64 string.'
	}
};