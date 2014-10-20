function containsKey( list , keys ){
	var returnArray = {};
	for (var key in keys) {
		if(typeof list[keys[key]] !== 'undefined'){
			returnArray[keys[key]] = list[keys[key]];
		}
	}
	return returnArray;
}
document.addEventListener('DOMContentLoaded', function(){

	var editor = ace.edit("editor");
	//	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/javascript");

	editor.getSession().on('change', function(e) {
    try {
			for(var i in Berry.instances){
				Berry.instances[i].destroy();
			}
      $('.target').berry(
      	$.extend({autoFocus: false, actions: false}, JSON.parse(editor.getValue())) ).on('change', function(){
				console.clear();
				console.log(this.toJSON(null, true));
				$('.result').html("<pre>"+JSON.stringify(this.toJSON(), undefined, 2)+"</pre>");
			}).trigger("change");
    } catch (e) {
        return false;
    }
	});

	//editor.setValue('{\n\t"fields": {\n\t\t"Name": {"type": "text"}, \n\t\t"Salutation": {"type": "select", "choices": ["Hello", "Bye"]}\n\t}\n}');
	editor.setValue(Cookies.get('form'));
	// $('.target').berry({autoFocus: false, actions: false,
	// 	fields: JSON.parse(editor.getValue())
	// });

	//$('.source').html(JSON.stringify(fields));
});
	// "fs_c":{"type": "fieldset", "legend": "Thing", "fields": {
	// 	"fs": {"label":false, "type": "fieldset","max":2, "multiple": {"duplicate": true}, "toArray": true, "fields": {
	// 		"Name2": {}
	// 	}}
	// }}