Berry.processConditions = function(conditions, func) {
	if (typeof conditions === 'string') {
		if(conditions === 'show' || conditions === 'enabled'  || conditions === 'parsable') {
			conditions = this.item[conditions];
		}else if(conditions === 'enable') {
			conditions = this.item.enable;
		}
	}
	if (typeof conditions === 'boolean') {
		return conditions;
	}
	if (typeof conditions === 'object') {
		var keys = [];
		for(var c in conditions){
			keys.push(Berry.conditions[c].call(this, this.owner, conditions[c], (func || conditions[c].callBack)));
		}
		return keys;
	}
	return true;
};

Berry.conditions = {
	requires: function(Berry, args, func) {
		return Berry.on('change:' + args.name, $.proxy(function(args, local, topic, token) {
				func.call(this, (local.value !== null && local.value !== ''), token);
			}, this, args)
		).lastToken;
	},
	// valid_previous: function(Berry, args) {},
	not_matches: function(Berry , args, func) {
		return Berry.on('change:' + args.name, $.proxy(function(args, local, topic, token) {
				func.call(this, (args.value  !== local.value), token);
			}, this, args)
		).lastToken;
	},
	matches: function(Berry, args, func) {
		return Berry.on('change:' + args.name, $.proxy(function(args, local, topic, token) {
				func.call(this, (args.value  === local.value), token);
			}, this, args)
		).lastToken;
	},
	// hasclass: function(Berry,args) {
	// 	if($(args.selector).hasClass(args.match)){
	// 		return true;
	// 	}else{
	// 		return false;
	// 	}
	// }
};
