Berry.renderers['popins'] = function(owner) {
	this.owner = owner;
	this.fieldset = function(data) {
		Berry.render('berry_base_fieldset',data);
	};
	this.render = function() {
		return $('<div/>');
	};
	this.initialize = function() {
		if(typeof this.owner.options.popins_template === 'string'){
			this.owner.$el.html(Berry.render(this.owner.options.popins_template , {fields: this.owner.toArray()}));
		}
		for(var i in this.owner.fields){
			this.create(this.owner.fields[i]);
		}
		$('body').off('click', '.popoverCancel');
		$('body').on('click', '.popoverCancel', function(){
			$('.popins').popover('hide');
			field = Berry.instances[$(this).closest('.row').data('berry')].fields[$(this).data('name')];
			field.revert();
						$('[name=' + field.name + '].popins').popover('destroy').siblings('.popover').remove();

			Berry.renderers.popins.prototype.create(field);
			$('[name=' + $(this).data('name') + '].popins').focus();
		});
		$('body').off('click', '.popoverSave');
		$('body').on('click', '.popoverSave', function() {
			var fl = Berry.instances[$(this).closest('.row').data('berry')];
			var field = fl.fields[$(this).data('name')];
			$(field.self).find('.form-control').blur();
			fl.performValidate(field, field.getValue());
			if(field.valid) {
				$('[name=' + $(this).data('name') + '].popins').focus();
				field.toJSON();
				$('[name=' + $(this).data('name') + '].popins').html(field.display).popover('hide');
				fl.trigger('updated');
				fl.trigger('save');
			}else{
				field.focus();
			}
		});
		$('body').keydown(function(event) {
			switch(event.keyCode) {
				case 27://escape
					$('.popover.in .popoverCancel').click();
					break;
				case 13://enter
					$('.popover.in .popoverSave').click();
					break;
			}
		});
		this.owner.each(function() {
			$('[name=' + this.name + '].popins').html(this.display);
		});
	};
};

Berry.renderers.popins.prototype.create = function(field){
	var pOpts = $.extend({title:(field.prompt || field.label), content: field.self, html: true, placement: 'top', template: '<div class="popover berry"><div class="arrow"></div><h3 class="popover-title"></h3><div style="min-width:270px" class="popover-content"></div></div>'}, field.owner.options.popins, field.popins);
	var target = $('[name=' + field.name + '].popins');
	target.popover(pOpts);
	target.on('hidden.bs.popover', function () {
		$('.berry.popover').css({display:"none"});
	});
	target.on('show.bs.popover', function () {
		$('.popover.in .popoverCancel').click();
	});
	target.on('shown.bs.popover', function () {
		var field = Berry.instances[$('.berry.popover').find('.row').data('berry')].fields[$('.berry.popover').find('.row').attr('name')];
		field.initialize();
		field.focus();
	});
};

Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function(){
		if(this.options.renderer == 'popins'){
		$.extend(this.options.default,{hideLabel: true});
			if(this.save){
				this.on('updated',	function() { this.save(); });
			}
		}
	}
});