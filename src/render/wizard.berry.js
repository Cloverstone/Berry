Berry.renderers['wizard'] = function(owner) {
	this.owner = owner;
	this.fieldset = function(data){
		return Berry.render('berry_' + this.owner.options.renderer + '_fieldset', data);
	};
	this.render = function(){
		this.owner.$el.html(Berry.render('berry_' + this.owner.options.renderer + '_form', this.owner.options));
		return this.owner.$el.find('form');
	};
	this.$element = null;
	this.update = function(){
		this.$element.find('ul').html(Berry.render('berry_wizard_steps',this.owner));
		$('[data-id=berry-submit],[data-id=wizard-next]').hide();
		$('.step-pane').removeClass('active');
		$('#step' + (this.owner.currentSection + 1)).addClass('active');
		if((this.owner.currentSection + 1) != this.owner.section_count){
			$('[data-id=wizard-next]').show();
		}else{
			$('[data-id=berry-submit]').show();
		}
		if(this.owner.currentSection === 0){
			$('[data-id=wizard-previous]').hide();
		}else{
			$('[data-id=wizard-previous]').show();
		}
		// reset the wizard position to the left
		this.$element.find('ul').first().attr('style','margin-left: 0');

		// check if the steps are wider than the container div
		var totalWidth = 0;
		this.$element.find('ul > li').each(function () {
			totalWidth += $(this).outerWidth();
		});
		var containerWidth = 0;
		if (this.$element.find('.actions').length) {
			containerWidth = this.$element.width() - this.$element.find('.actions').first().outerWidth();
		} else {
			containerWidth = this.$element.width();
		}
		if (totalWidth > containerWidth) {
		
			// set the position so that the last step is on the right
			var newMargin = totalWidth - containerWidth;
			this.$element.find('ul').first().attr('style','margin-left: -' + newMargin + 'px');
			
			// set the position so that the active step is in a good
			// position if it has been moved out of view
			if (this.$element.find('li.' + this.owner.sectionList[this.owner.currentSection].state ).first().position().left < 200) {
				newMargin += this.$element.find('li.' + this.owner.sectionList[this.owner.currentSection].state ).first().position().left - 200;
				if (newMargin < 1) {
					this.$element.find('ul').first().attr('style','margin-left: 0');
				} else {
					this.$element.find('ul').first().attr( 'style' , 'margin-left: -' + newMargin + 'px');
				}
			}
		}
	};
	this.next = function(){
		this.owner.valid = true;
		this.owner.toJSON();
		this.owner.each(this.owner.validateItem, null, this.owner.sections[this.owner.currentSection].children);
		if(this.owner.valid){
			if(this.owner.currentSection < (this.owner.section_count - 1)){
				this.owner.sectionList[this.owner.currentSection].state = 'complete';
				this.owner.currentSection++;
				this.owner.clearErrors();
				this.owner.sectionList[this.owner.currentSection].state = 'active';
			}
		}else{
			this.owner.sectionList[this.owner.currentSection].state = 'error';
		}
		this.update();
	};
	this.previous = function(){
		if(this.owner.currentSection > 0){
			this.owner.sectionList[this.owner.currentSection].state = 'disabled';
			this.owner.currentSection--;
			this.owner.sectionList[this.owner.currentSection].state = 'active';
		}
		this.update();
	};
	this.sectionClick = function(e){
		var clickedSection = parseInt($(e.currentTarget).data('target').replace('#step', ''), 10) - 1;
		if(clickedSection < this.owner.currentSection) {
			for(var i = clickedSection; i <= this.owner.currentSection;  i++){
				this.owner.sectionList[i].state = 'disabled';
			}
			this.owner.currentSection = clickedSection;
			this.owner.sectionList[this.owner.currentSection].state = 'active';
		}
		this.update();
	};
	this.initialize = function() {
		this.owner.sectionList[0].state = 'active';
		this.owner.currentSection = 0;
		if((this.owner.currentSection + 1) == this.owner.section_count){
			$('[data-id=wizard-next]').hide();
		}else{
			$('[data-id=berry-submit]').hide();
		}
		if(this.owner.currentSection === 0){
			$('[data-id=wizard-previous]').hide();
		}else{
			$('[data-id=wizard-previous]').show();
		}

		this.$element = this.owner.$el.find('.wizard');
		this.$element.find('ul').html(Berry.render('berry_wizard_steps',this.owner));
		$('#step1').addClass('active');
		$('body').on('click','.wizard li',$.proxy(this.sectionClick,this));
		$('body').on('click','[data-id=wizard-next]',$.proxy(this.next,this));
		$('body').on('click','[data-id=wizard-previous]',$.proxy(this.previous,this));
	};
};

Berry.btn['previous'] = {
			'label': "Previous",
			'icon':'arrow-left',
			'id': 'wizard-previous',
			'modifier': 'danger pull-left'
		};
Berry.btn['next'] = {
			'label': "Next",
			'icon':'arrow-right',
			'id': 'wizard-next',
			'modifier': 'success pull-right'
		};
Berry.btn['finish'] = $.extend({}, Berry.btn['save'], {label: 'Finish'});


Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function(){
		if(this.options.renderer == 'wizard') {
			this.sectionsEnabled = true;
			this.options.actions = ['finish', 'next', 'previous'];
		}
	}
});
