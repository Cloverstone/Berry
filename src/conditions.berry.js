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
	test: function(Berry, args, func) {
		return Berry.on('change:' + this.name, $.proxy(function(args, local, topic, token) {
				func.call(this, args(), token);
			}, this, args)
		).lastToken;
	},
	multiMatch: function(Berry, args, func) {
		Berry.on('change:' + _.map(args, 'name').join(' change:'), $.proxy(function(args, local, topic) {
			func.call(this, function(args,form){
				var status = false;
				for(var i in args) {
					var val = args[i].value; 
					var localval = form.toJSON()[args[i].name];
					
					if(typeof val == 'object' && localval !== null){
						status = (val.indexOf(localval) !== -1);
					}else{
						status = (val == localval);
					}
					if(!status)break;
				}
				return status;
			}(args, Berry), 'mm');
		}, this, args))
		return 'mm';
	}
};
