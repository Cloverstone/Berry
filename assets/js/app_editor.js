document.addEventListener('DOMContentLoaded', function(){

		cb = new cobler({target: '#editor', types: ['form']});
		cb.load(JSON.parse((Cookies.get('form') || "{}")));
		cb.on("change",function(){

				$('.result').html("<pre>"+JSON.stringify(this.toJSON(), undefined, 2)+"</pre>");
				Cookies.set('form', JSON.stringify(this.toJSON(), undefined, 2));
		})
});
