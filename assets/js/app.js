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
      	$.extend({autoFocus: false, actions: false, name: 'myForm'}, JSON.parse(editor.getValue())) ).delay('change', function(){
        var json = this.toJSON();
				$('.result').html("<pre>"+JSON.stringify(json, undefined, "\t")+"</pre>");
        location.hash = '#'+$.param(json);
			}, true);
    } catch (e) {
        return false;
    }
	});
			var stuff = JSON.parse(($.jStorage.get('form') || "{}"));
			for(var i in stuff){
				delete stuff[i].widgetType;
			}
	editor.setValue(JSON.stringify({fields: stuff}, undefined, "\t"));
});

$('#basic').on('click',function() {
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
		"fs": {"label":false, "type": "fieldset", "multiple": {"duplicate": true, "max": 2,}, "toArray": true, "fields": {
			"Candy Type": {}
		}
  }}}
]}
, undefined, "\t"));


});

$('#nonfields').on('click',function() {
editor.setValue(JSON.stringify(
{
"attributes":{"name": "John Doe", "candy": "Other"},
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



$('#auto').on('click',function() {
editor.setValue(JSON.stringify(
{
  "fields": {
    "Text": {},
    "Text 2": "",
    "Color": "color",
    "Options 1": ["hello"],
    "Options 2": ["hello","goodbye"],
    "Options 3": ["hello", "more","Another", "dasdf"],
    "Options 5": ["hello", "more","Another", "final","past"],
    "Is?": {"type": "checkbox"}
  }
}, undefined, "\t"));
});
$('#builder').on('click',function() {
			var stuff = JSON.parse($.jStorage.get('form'));
			for(var i in stuff){
				delete stuff[i].widgetType;
			}
	editor.setValue(JSON.stringify({"fields": stuff}, undefined, "\t"));
});