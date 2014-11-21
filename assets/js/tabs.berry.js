
templates['berry_tabs_fieldset'] = Hogan.compile('<div class="tab-pane" id="tab{{owner.section_count}}">{{>berry_base_fieldset}}</div>');
templates['berry_tabs'] = Hogan.compile('<ul class="nav nav-tabs">{{#sectionList}}<li><a href="#tab{{index}}" data-toggle="tab">{{{text}}}</a></li>{{/sectionList}}</ul>');
Berry.renderers['tabs'] = function(owner) {
	this.owner = owner;
	this.fieldset = function(data){
		if(data.parent === null){
			return Berry.render('berry_tabs_fieldset', data);
		}
		return Berry.render('berry_base_fieldset', data);
	};
	this.render = function(){

		this.owner.$el.html(Berry.render('berry_base_form', this.owner.options));
		return this.owner.$el.find('form');
	};

	this.initialize = function() {
		if(this.owner.options.tabsTarget){
			this.owner.on('destroy', function(){
				this.options.tabsTarget.empty();
			});
		}else{
			this.owner.options.tabsTarget = this.owner.$el;
		}
		this.owner.options.tabsTarget.prepend(Berry.render('berry_tabs', this.owner)).find('a:first').tab('show');

	};
};
Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		if(this.options.renderer == 'tabs') {
			this.sectionsEnabled = true;
			this.options.modifiers += " tab-content";
		}
	}
});
