$('#json').on('click', function(e){
  $(e.target).siblings().removeClass('active');
  $(e.target).addClass('active');
  $('.view').addClass('hidden');
  $('.view_json').removeClass('hidden');  
  $('.target').removeClass('hidden');

  $('#editor').addClass('hidden');
});
$('#cobler').on('click', function(e) {
  $(e.target).siblings().removeClass('active');
  $(e.target).addClass('active');
  $('.view').addClass('hidden');

  $('.view_result').removeClass('hidden');
  $('.view_source').removeClass('hidden');
  $('#editor').removeClass('hidden');
  $('.target').addClass('hidden');
    if(typeof cb === 'undefined'){
      cb = new cobler({target: '#editor', types: ['form']});
          cb.on("change", function(){
          if(typeof forms[form] !== 'undefined'){
            $.extend(forms[form], {fields:this.toJSON()});
          }else{
            $.jStorage.set('form', JSON.stringify(this.toJSON(), undefined, "\t"));
          }
    })
    }
    if(typeof forms[form] !== 'undefined'){
      var temp = $.extend(true, {}, forms[form]);
      for(var i in temp.fields){
        if(typeof temp.fields[i].type !== 'undefined' && temp.fields[i].type.length > 0){
          switch(temp.fields[i].type){
            case "select":
            case "radio":
              temp.fields[i].widgetType = 'select';
              break;
            case "checkbox":
              temp.fields[i].widgetType = 'checkbox';
              break;
            default:
              temp.fields[i].widgetType = 'textbox';
              break;
          }
        }else{
          temp.fields[i].widgetType = 'textbox';
        }
      }
      cb.load(temp.fields);
    }else{
      cb.load(JSON.parse(($.jStorage.get('form') || "{}")));
    }

});
$('#schema').on('click', function(e) {
  $(e.target).siblings().removeClass('active');
  $(e.target).addClass('active');
  $('.view').addClass('hidden');
  $('.view_schema').removeClass('hidden'); 
  $('.target').removeClass('hidden');

  $('#editor').addClass('hidden');
              for(var i in forms[form].fields){
                delete forms[form].fields[i].widgetType;
              }
  editor.setValue(JSON.stringify(forms[form], undefined, "\t"));
});




block = false;
document.addEventListener('DOMContentLoaded', function(){

	editor = ace.edit("schema_editor");
	//	editor.setTheme("ace/theme/monokai");
	editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setTabSize(2);
	editor.getSession().on('change', function(e) {
    if(!block){
      var stringified = editor.getValue()
      if(!(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(stringified.replace(/"(\\.|[^"\\])*"/g,'')))) {
        try {
          forms[form] = JSON.parse(stringified);
    			for(var i in Berry.instances){
    				Berry.instances[i].destroy();
    			}
          $('.target').berry(
          	$.extend({autoFocus: false, actions: ['save'], name: 'myForm', attributes: QueryStringToHash(document.location.hash.substr(1) || "") }, forms[form] ) ).delay('change', function(){
            var json = this.toJSON();

            if(this.options.template){

              $('.result').html("<pre>"+this.options.template.render(json)+"</pre>");
            }else{
    				  $('.result').html("<pre>"+JSON.stringify(json, undefined, "\t")+"</pre>");
            }
    			}, true).on('save', function(){
            if(this.validate()){
              location.hash = '#'+$.param(this.toJSON());
            }
            // $.extend(forms[form], {attributes: this.toJSON()});
            // if(!$('.view_schema').hasClass('hidden')){
            //   block = true;
            //   for(var i in forms[form].fields){
            //     delete forms[form].fields[i].widgetType;
            //   }

            //   editor.setValue(JSON.stringify(forms[form], undefined, "\t"));
            // }
          });

          block = false;
        } catch (e) {
            return false;
        }
      }
    }
	});
	var stuff = JSON.parse(($.jStorage.get('form') || "{}"));
	for(var i in stuff){
		delete stuff[i].widgetType;
	}
  form = (urlParams['demo'] || 'example');
  $('#'+form).click();

  editor.setValue(JSON.stringify(forms[form], undefined, "\t"));
	//editor.setValue(JSON.stringify({fields: stuff}, undefined, "\t"));
});


$('#builder').on('click',function() {
      var stuff = JSON.parse($.jStorage.get('form'));
      for(var i in stuff){
        delete stuff[i].widgetType;
      }
      editor.setValue(JSON.stringify({"fields": stuff}, undefined, "\t"));
});




// $('#example').on('click', function(e) {
//   form = 'example';
//   editor.setValue(JSON.stringify(forms.example, undefined, "\t"));
// });
// $('#basic').on('click', function() {
//   form = 'basic';
//   editor.setValue(JSON.stringify(forms.basic, undefined, "\t"));
// });
// $('#conditional').on('click', function(){  
//   form = 'conditional';
//   editor.setValue(JSON.stringify(forms.conditional, undefined, "\t"));
// });
// $('#duplicate').on('click', function(){
//   form = 'duplicate';
//   editor.setValue(JSON.stringify(forms.duplicate, undefined, "\t"));
// });
// $('#nonfields').on('click', function() {
//   form = 'nonfields';
//   editor.setValue(JSON.stringify(forms.nonfields, undefined, "\t"));
// });
// $('#auto').on('click', function() {
//   form = 'auto';
//   editor.setValue(JSON.stringify(forms.auto, undefined, "\t"));
// });

// $('#builder').on('click', function() {
//     form = '';
// });


forms = {
  "auto": {
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
  },
  "nonfields": {
    "attributes":{"name": "John Doe", "candy": "Other"},
    "inline": true,
    "fields": [
      {
        "label": "Name"
      },
      {
        "label": "Title"
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
  },
  "duplicate": {
    "fields": [
      {
        "label": "Name"
      },
      {
        "label": "Title"
      },
      {"name": "fc_container", "legend": "Favorite Candies", "fields": {
        "fc": {"label":false, "multiple": {"duplicate": true, "max": 4, "min": 2}, "fields": {
          "Candy Type": {}
        }
      }}}
    ]
  },
  "conditional": {
    "fields": [
      {
        "label": "Name"
      },
      {
        "label": "Title"
      },
      {
        "label": "Favorite Candy",
        "name": "candy",
        "choices": [
          "Lolipops",
          "Chocolate",
          "Other"
        ]
      },
      {"label": "Reason", "type": "textarea", "show": {"matches": {"name": "candy", "value": "Chocolate"}}}  
    ]
  },
  "basic": {
    "fields": [
      {
        "label": "Name"
      },
      {
        "label": "Job Title",
        "name": "title"
      },
      {
        "label": "Favorite State",
        "choices": "data/states.json"
      }
    ]
  },
  "example": {      
    "attributes": {"first_name": "John", "name_last": "Doe"},
    "fields":[
      {"label": "First Name"}, 
      {"label": "Last Name", "name": "name_last"},
      {"label": "Age", "type": "number"},
      {"label": "Favorite Color", "type": "color"}
    ]
  }
}

/*utils*/

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();


var QueryStringToHash = function QueryStringToHash  (query) {
  var query_string = {};
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    pair[0] = decodeURIComponent(pair[0]);
    debugger;
    pair[1] = decodeURIComponent((pair[1] || "").split('+').join(' '));
      // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
  return query_string;
};
