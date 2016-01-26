document.addEventListener('DOMContentLoaded', function(){

		cb = new cobler({target: '#editor', types: ['form']});
		cb.load(JSON.parse(($.jStorage.get('form') || "{}")));
		cb.on("change", function(){

				$('.result').html("<pre>"+JSON.stringify({fields: this.toJSON()}, undefined, "\t")+"</pre>");
				$.jStorage.set('form', JSON.stringify(this.toJSON(), undefined, "\t"));
		})
});
