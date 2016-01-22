(function(b, $){
  b.register({
    type: 'image_picker',
    default: {autosize: true, advanced: false},
    setup: function() {
      this.$el = this.self.find('input');
      this.$el.off();
      if(this.onchange !== undefined){ this.$el.on('input', this.onchange);}
      this.$el.on('input', $.proxy(function() {
        this.trigger('change');
      }, this));
      this.self.find('button,img').on('click', $.proxy(function(){
        this.modal = $().berry({legend:(this.label || "Choose One"), fields:{
          Image:{
            label: false,
            value: this.value, 
            options: this.options,
            choices: this.choices,
            value_key: this.value_key,
            label_key: this.label_key,
            root: this.path,
            type:'grid_select'
          }
        } }).on('save', function(){
          this.update({value:this.modal.fields.image.toJSON()})
          this.modal.trigger('cancel');
        }, this)
      },this));
    },
    setValue: function(value){
      if(this.value != value) {
        this.update({value:value})
      }
    },
  });
})(Berry,jQuery);