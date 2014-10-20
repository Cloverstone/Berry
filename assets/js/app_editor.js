document.addEventListener('DOMContentLoaded', function(){

		cb = new cobler({target: '#editor', types: ['form']});
		//cb.load(this.model.attributes.json);
		cb.on("change",function(){

				$('.result').html("<pre>"+JSON.stringify(this.toJSON(), undefined, 2)+"</pre>");
				Cookies.set('form', JSON.stringify(this.toJSON(), undefined, 2));
		})
});
