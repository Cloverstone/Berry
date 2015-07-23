Berry.renderers['popins'] = function(owner) {
	this.owner = owner;
	// this.selector = 
	this.fieldset = function(data) {
		Berry.render('berry_base_fieldset',data);
	};
	this.render = function() {
		return $('<div/>');
	};
	this.initialize = function() {
		if(typeof this.owner.options.popins_template === 'string'){
			// debugger;
			this.owner.$el.html(Berry.render(this.owner.options.popins_template , {fields: _.toArray(this.owner.fields)}));
		}
		// for(var i in this.owner.fields){
		// 	this.create(this.owner.fields[i]);
		// }
		this.owner.each(function(_this) {
			_this.create(this);
		}, [this]);
		$('body').off('click', '.popoverCancel');
		$('body').on('click', '.popoverCancel', function(){
			$('.popins').popover('hide');
			field = Berry.instances[$(this).data('berry')].find($(this).data('name'));
			field.revert();
						$('[name="' + field.name + '"].popins').popover('destroy').siblings('.popover').remove();

			Berry.renderers.popins.prototype.create(field);
			$('[name="' + $(this).data('name') + '"].popins').focus();
		});
		$('body').off('click', '.popoverSave');
		$('body').on('click', '.popoverSave', function() {
			var fl = Berry.instances[$(this).data('berry')];
			var name = $(this).data('name');
			var field = fl.find(name);
			$(field.self).find('.form-control').blur();
			fl.performValidate(field, field.getValue());
			if(field.valid) {
				// debugger;
				field.toJSON();
				fl.$el.find('[name="' + name + '"].popins').focus().html(field.display).popover('hide');
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
		this.owner.each(function() {
			this.owner.$el.find('[name="' + this.name + '"].popins').html(this.display);
		});
	};
};

Berry.renderers.popins.prototype.create = function(field){
	var pOpts = $.extend(/*{trigger: "manual" , html: true, animation:false},*/{container: '#content', viewport:{ selector: '#content', padding: 20 }}, {    title:'<div style="padding-left:0"><div class="btn-group pull-right"><div style="margin-left:2px;" class="btn-xs popoverCancel fa fa-times btn btn-danger" data-name="'+field.name+'" data-berry="'+field.owner.options.name+'"></div><div class="btn-xs fa fa-check btn btn-success popoverSave" data-name="'+field.name+'" data-berry="'+field.owner.options.name+'"></div></div></div>'+(field.prompt || field.label), content: field.self, html: true, placement: 'auto right', template: '<div class="popover berry"><div class="arrow"></div><h3 class="popover-title"></h3><div style="min-width:270px" class="popover-content"></div></div>'}, field.owner.options.popins, field.popins);
// debugger;
	var target = this.owner.$el.find('[name="' + field.name + '"].popins');
	 target.popover(pOpts);

//not great but the general idea
// target.popover(pOpts)
// .on("mouseenter", function () {
//   var _this = this;
//   if(!$(this).data('bs.popover').tip().hasClass('in')){
//   		$(this).popover("show");
	    // $(".popover").on("mouseleave", function () {
	    //     $(_this).popover('hide');
	    // });
//   }
// })
// .on("mouseleave", function () {
//     var _this = this;
//     setTimeout(function () {
//         if (!$(".popover:hover").length) {
//             $(_this).popover("hide");
//         }
//     }, 300);
// });





	target.on('hidden.bs.popover', function () {
		$('.berry.popover').css({display:"none"});
	});
	target.on('show.bs.popover', function () {
		$('.popover.in .popoverCancel').click();
	});
	target.on('shown.bs.popover', function () {
		var field = Berry.instances[$('.berry.popover').find('.row').data('berry')].find($('.berry.popover').find('.row').attr('name'));
		field.initialize();
		debugger;
		field.focus();
	});
};

Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function(){
		if(this.options.renderer == 'popins'){
			this.options.default = {hideLabel: true};
			this.options.options.inline = true;
			// default: {hideLabel: true}
		$.extend(this.options.default,{hideLabel: true});
			// if(this.save){
			// 	this.on('updated',	function() { this.save(); });
			// }
			//this.on('updated', function() {debugger; this.trigger('save'); });
		}
	}
});