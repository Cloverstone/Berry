Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		if((typeof this.$el == 'undefined') || !this.$el.length) {
			this.$el = $('<div/>');

			this.ref = $(ich.modal(this.options));
			$(this.ref).appendTo('body');

			this.options.legendTarget = this.ref.find('.modal-title');
			this.options.actionTarget = this.ref.find('.modal-footer');
			this.$el = this.ref.find('.modal-body');

			this.ref.modal();

			this.ref.on('shown.bs.modal', $.proxy(function () {
				this.$el.find('.form-control:first').focus();
			},this));

			//Add two more ways to hide the modal (escape and X)
			this.on('cancel', $.proxy(function(){
				this.ref.modal('hide');
			},this));
			
			this.on('saved', $.proxy(function(){
				//alert('hide modal');
				this.ref.modal('hide');
				this.closeAction = 'save';
			},this));

			//After the modal is hidden destroy the form that it contained
			this.ref.on('hidden.bs.modal', $.proxy(function () {

				this.closeAction = (this.closeAction || 'cancel');
				this.destroy();

			},this));

			//After the form has been destroyed remove it from the dom
			this.on('destroyed', $.proxy(function(){
				this.ref.remove();
				this.trigger('completed');
			},this));
		}
	}
});