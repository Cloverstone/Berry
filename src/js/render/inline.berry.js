Berry.renderers['inline'] = function(owner) {
	this.owner = owner;
	this.fieldset = function(data){
		Berry.render('berry_base_fieldset',data);
	};
	this.render = function(){
		return $('<div/>');
	};
	this.initialize = function(){
		if(typeof this.owner.options.popins === 'string'){
			this.owner.$el.html(Berry.render(this.owner.options.popins , {fields: this.owner.toArray()}));
		}
		for(var i in this.owner.fields){
			this.create(this.owner.fields[i]);
		}
		$(this.owner.$el).off('click','.popoverCancel');
		$(this.owner.$el).on('click','.popoverCancel', function() {
			//$('.popins').popover('hide');
			item = Berry.instances[$(this).closest('.row').data('berry')].fields[$(this).data('name')];
			//$('[name=' + item.name + '].popins').popover('destroy').siblings('.popover').remove();
			item.revert();
			Berry.renderers.inline.prototype.create(item);
			$('[name=' + $(this).data('name') + '].popins').html(
					Berry.instances[$(this).closest('.row').data('berry')].fields[$(this).data('name')].display
				);
			$('[name=' + $(this).data('name') + '].popins').focus();
		});

		$(this.owner.$el).off('click','.popoverSave');
		$(this.owner.$el).on('click','.popoverSave', function() {
			var fl = Berry.instances[$(this).closest('.row').data('berry')];
			var item = fl.fields[$(this).data('name')];
			$(item.self).find('.form-control').blur();
			fl.performValidate(item , item.factory.toJSON(item.self));
			if(item.valid){
				$('[name=' + $(this).data('name') + '].popins').focus();
				item.toJSON();
				$('[name=' + $(this).data('name') + '].popins').html(
					item.display
				);//.popover('hide');
				fl.trigger('updated');
			}else{
				$(item.self).find('.form-control').focus();
				//$(".popover.in .form-control").focus();
			}
		});

		$(this.owner.$el).keydown(function(event) {
			switch(event.keyCode){
				case 27://escape
					$('.popoverCancel').click();
					break;
				case 13://enter
					$('.popoverSave').click();
					break;
			}
		});

	};
};

Berry.renderers.inline.prototype.create = function(item){
	$(item.owner.$el).find('[name=' + item.name + '].popins').on('click', $.proxy(function () {
		$(item.owner.$el).find('[name=' + item.name + '].popins').html(this.self);
	},item) );
};

Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function(){
		if(this.options.renderer == 'inline'){
			if(this.save){
				this.on('updated',	function() { this.save(); });
			}
		}
	}
});