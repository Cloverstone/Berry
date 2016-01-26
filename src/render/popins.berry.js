Berry.renderers['popins'] = function(owner) {
	this.owner = owner;
	// this.selector = 
	this.fieldset = function(data) {
		Berry.render('berry_base_fieldset', data);
	};
	this.render = function() {
		return $('<div/>');
	};
	this.initialize = function() {
		this.owner.on('destroy', function(){
			$('.row.form-group[data-berry='+this.options.name+']').closest('.popover').remove();
		})
		if(typeof this.owner.options.popins_template === 'string'){
			this.owner.$el.html(Berry.render(this.owner.options.popins_template , {fields: _.toArray(this.owner.fields)}));
		}
		this.owner.each(function(_this) {
			_this.create(this);
		}, [this]);
		$('body').off('click', '.popoverCancel');
		$('body').on('click', '.popoverCancel', function(){
			$('[data-popins]').popover('hide');
			var fl = Berry.instances[$(this).data('berry')];
			var field = fl.find($(this).data('name'));
			field.revert();
			//fl.$el.find('[name="' + field.name + '"].popins').popover('destroy').siblings('.popover').remove();
			//Berry.renderers.popins.prototype.create(field);
			$('[data-popins="' + $(this).data('name') + '"]').focus();
		});
		$('body').off('click', '.popoverSave');
		$('body').on('click', '.popoverSave', function() {
			var fl = Berry.instances[$(this).data('berry')];
			var name = $(this).data('name');
			var field = fl.find(name);
			$(field.self).find('.form-control').blur();
			fl.performValidate(field, field.getValue());
			if(field.valid) {
				field.toJSON();
				fl.$el.find('[data-popins="' + name + '"]').focus().html(field.display).popover('hide');
				// fl.$el.find('[name="' + name + '"].popins')
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
		this.owner.on('loaded', $.proxy(function(){
			this.owner.each(function() {
				this.owner.$el.find('[data-popins="' + this.name + '"]').html(this.display);
			});
		},this))

	};
};

Berry.renderers.popins.prototype.create = function(field){
	var target = field.owner.$el.find('[data-popins="' + field.name + '"]');
	var pOpts = $.extend(/*{trigger: "manual" , html: true, animation:false},*/{container: '#'+field.owner.$el.attr('id'), viewport:{ selector: '#content', padding: 20 }}, {    title:'<div style="padding-left:0"><div class="btn-group pull-right"><div style="margin-left:2px;" class="btn-xs popoverCancel fa fa-times btn btn-danger" data-name="'+field.name+'" data-berry="'+field.owner.options.name+'"></div><div class="btn-xs fa fa-check btn btn-success popoverSave" data-name="'+field.name+'" data-berry="'+field.owner.options.name+'"></div></div></div>'+(field.prompt || field.label), content: field.self, html: true, placement: 'left auto', template: '<div class="popover berry"><div class="arrow"></div><h3 class="popover-title"></h3><div style="min-width:270px" class="popover-content"></div></div>'}, field.owner.options.popins, field.popins);

	target.popover(pOpts);
	target.on('hidden.bs.popover', function () {
		$('.berry.popover').css({display:"none"});
	});
	target.on('show.bs.popover', function () {
		$('.popover.in .popoverCancel').click();
	});
	target.on('shown.bs.popover', function () {
		var field = Berry.instances[$('.berry.popover').find('.row').data('berry')].find($('.berry.popover').find('.row').attr('name'));
		field.initialize(); //maybe not needed
		field.focus();
	});
};

Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function(){
		if(this.options.renderer == 'popins'){
			this.options.default = {hideLabel: true};
			this.options.inline = true;
			$.extend(this.options.default,{hideLabel: true});
		}
	}
});