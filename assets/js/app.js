
document.addEventListener('DOMContentLoaded', function(){

	editor = ace.edit("editor");
	//	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setTabSize(2);
	editor.getSession().on('change', function(e) {
    try {
			for(var i in Berry.instances){
				Berry.instances[i].destroy();
			}
      $('.target').berry(
      	$.extend({autoFocus: false, actions: false, attributes: 'hash'}, JSON.parse(editor.getValue())) ).on('change', function(){
				console.clear();
				console.log(this.toJSON(null, true));
				$('.result').html("<pre>"+JSON.stringify(this.toJSON(), undefined, "\t")+"</pre>");
        window.location.hash = '#'+$.param(this.toJSON());
			}).trigger("change");
    } catch (e) {
        return false;
    }
	});
			var stuff = JSON.parse(($.jStorage.get('form') || "{}"));
			for(var i in stuff){
				delete stuff[i].widgetType;
			}
//	editor.setValue('{\n\t"fields": {\n\t\t"Name": {"type": "text"}, \n\t\t"Salutation": {"type": "select", "choices": ["Hello", "Bye"]}\n\t}\n}');
	editor.setValue(JSON.stringify({fields: stuff}, undefined, "\t"));
	//editor.setValue();
	// $('.target').berry({autoFocus: false, actions: false,
	// 	fields: JSON.parse(editor.getValue())
	// });

	//$('.source').html(JSON.stringify(fields));
});

$('#basic').on('click',function() {
	//editor.setValue('{\n\t"fields": {\n\t\t"Name": {"type": "text"}, \n\t\t"Salutation": {"type": "select", "choices": ["Hello", "Bye"]}\n\t}\n}');
editor.setValue(JSON.stringify({"fields": [
  {
    "label": "Name",
    "type": "text",
    "required": false,
    "name": "name",
  },
  {
    "label": "Title",
    "type": "text",
    "name": "title",
  },
  {
    "label": "Favorite Candy",
    "name": "candy",
    "type": "select",
    "value": "",
    "choices": "./data/days.json"
  }
]}
, undefined, "\t"));
});

$('#conditional').on('click', function(){
	//editor.setValue('{\n\t"fields": {\n\t\t"Name": {"type": "text"}, \n\t\t"Salutation": {"type": "select", "choices": ["Hello", "Bye"]},\n\t\t	"Reason": {"type": "textarea", "show": {"matches": {"name": "salutation", "value": "Hello"}}}  \n\t}\n}');


editor.setValue(JSON.stringify({"fields": [
  {
    "label": "Name",
    "type": "text",
    "required": false,
    "name": "name",
  },
  {
    "label": "Title",
    "type": "text",
    "name": "title",
  },
  {
    "label": "Favorite Candy",
    "name": "candy",
    "type": "select",
    "value": "",
    "choices": [
      "Lolipops",
      "Chocolate",
      "Other"
    ]
  },
	{"label": "Reason", "name": "reason", "type": "textarea", "show": {"matches": {"name": "candy", "value": "Chocolate"}}}  
]}
, undefined, "\t"));



});

$('#duplicate').on('click', function(){
	//editor.setValue('{\n\t"fields": {\n\t\t"Name": {"type": "text"}, \n\t\t"Salutation": {"type": "select", "choices": ["Hello", "Bye"]},\n\t\t	"Reason": {"type": "textarea", "show": {"matches": {"name": "salutation", "value": "Hello"}}},\t"fs_c":{"type": "fieldset", "legend": "Thing", "fields": {\n\t\t"fs": {"label":false, "type": "fieldset","max":2, "multiple": {"duplicate": true}, "toArray": true, "fields": {\n\t\t\t"Name2": {}\n\t\t}\n\t}}}  \n\t}\n}');
editor.setValue(JSON.stringify({"fields": [
  {
    "label": "Name",
    "type": "text",
    "required": false,
    "name": "name",
  },
  {
    "label": "Title",
    "type": "text",
    "name": "title",
  },
	{"name": "fs_c", "type": "fieldset", "legend": "Favorite Candies", "fields": {
		"fs": {"label":false, "type": "fieldset","max":2, "multiple": {"duplicate": true}, "toArray": true, "fields": {
			"Candy Type": {}
		}
  }}}
]}
, undefined, "\t"));


});

$('#nonfields').on('click',function() {
	//editor.setValue('{\n\t"attributes":{"name": "Adam Smallcomb"},\n\t"options":{"inline": false}, \n\t"fields": {\n\t\t"Name": {"type": "text"}, \n\t\t"Salutation": {"type": "select", "choices": ["Hello", "Bye"]}\n\t}\n}');
editor.setValue(JSON.stringify(
{
"attributes":{"name": "Adam Smallcomb", "candy": "Other"},
"options":{"inline": false},
"fields": [
  {
    "label": "Name",
    "type": "text",
    "required": false,
    "name": "name",
  },
  {
    "label": "Title",
    "type": "text",
    "name": "title",
  },
  {
    "label": "Favorite Candy",
    "name": "candy",
    "type": "select",
    "value": "",
    "choices": [
      "Lolipops",
      "Chocolate",
      "Other"
    ]
  }
]
}
, undefined, "\t"));
});
$('#builder').on('click',function() {
	//editor.setValue('{\n\t"attributes":{"name": "Adam Smallcomb"},\n\t"options":{"inline": false}, \n\t"fields": {\n\t\t"Name": {"type": "text"}, \n\t\t"Salutation": {"type": "select", "choices": ["Hello", "Bye"]}\n\t}\n}');
			var stuff = JSON.parse($.jStorage.get('form'));
			for(var i in stuff){
				delete stuff[i].widgetType;
			}
//	editor.setValue('{\n\t"fields": {\n\t\t"Name": {"type": "text"}, \n\t\t"Salutation": {"type": "select", "choices": ["Hello", "Bye"]}\n\t}\n}');
	editor.setValue(JSON.stringify({"fields": stuff}, undefined, "\t"));
});