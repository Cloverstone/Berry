(function(b, $){
	
	b.register({
		type: 'cselect',
		create: function() {
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			if(this.reference){
				for(var i in this.options){
					this.options[i].image = this.options[i][this.reference];
				}
			}
			return b.render('berry_' + (this.elType || this.type), this);
		},
		setup: function() {
			this.$el = this.self.find('.dropdown');
			this.$el.find('li > a').off();
			this.$el.find('li > a').on('click', $.proxy(function(e){
				this.$el.find('a').removeClass('list-group-item-success');
				$(e.target).closest('a').addClass('list-group-item-success');
				this.$el.find('button').html(_.findWhere(this.options,{value:$(e.target).closest('a').attr('data-value')}).label+' <span class="caret"></span>')
				if(typeof this.onchange === 'function'){
					this.onchange();
				}
				this.trigger('change');
			}, this));
		},
		getValue: function() {
			if(this.$el.find('.list-group-item-success').length){
				return this.$el.find('.list-group-item-success').attr('data-value');
			}else{
				return this.value;
			}
		},
		setValue: function(val) {
			if(this.$el.find('[data-value="'+val+'"]').length){
				this.value = val;
				return this.$el.find('[data-value="'+val+'"]').click();
			}else if(typeof val !== 'object' && val && val.length){
				this.$el.find('a').removeClass('list-group-item-success');
				this.value = val;
				this.$el.find('button').html(val+' <span class="caret"></span>')
			}
		}
	});
})(Berry,jQuery);