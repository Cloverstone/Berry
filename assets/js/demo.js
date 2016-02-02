$('#json, #schema').on('click', function(e){
  $(e.target).siblings().removeClass('active');
  $(e.target).addClass('active');
  $('.view').addClass('hidden');
  $('.view_'+$(e.target).attr('id')).removeClass('hidden');  
  $('.target').removeClass('hidden');

  $('#editor').addClass('hidden');
  setSchema(forms[form]);
});
$('#cobler').on('click', function(e) {
  $(e.target).siblings().removeClass('active');
  $(e.target).addClass('active');
  $('.view, .target').addClass('hidden');
  $('.view_result, .view_source, #editor').removeClass('hidden');

    if(typeof cb === 'undefined'){
      // cb = new cobler({target: '#editor', types: ['form']});


      cb = new Cobler({targets: [document.getElementById('editor')],items:[]})
      var list = document.getElementById('sortableList');
      cb.addSource(list);
      cb.on('activate', function(){
        if(list.className.indexOf('hidden') == -1){
          list.className += ' hidden';
        }
      })
      cb.on('deactivate', function(){
        list.className = list.className.replace('hidden', '');
      })
      document.getElementById('sortableList').addEventListener('click', function(e) {
        cb.collections[0].addItem(e.target.dataset.type);
      })
      cb.on("change", function(){
        if(typeof forms[form] !== 'undefined'){
          $.extend(forms[form], {fields: cb.toJSON()[0]});
        }else{
          $.jStorage.set('form', JSON.stringify(cb.toJSON()[0], undefined, "\t"));
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
              options = temp.fields[i].options || temp.fields[i].choices;
              if(typeof options !== 'undefined'){
                // if(options.length )
        // if(item.options)
        switch(options.length){
          case 0:
            if(typeof temp.fields[i].fields === 'undefined'){
              temp.fields[i].type = 'text';
            }else{
              temp.fields[i].type = 'fieldset';
            }         

            temp.fields[i].widgetType = 'textbox';  
            break;
          case 2:
            temp.fields[i].falsestate = temp.fields[i].options[1].toLowerCase().split(' ').join('_');
          case 1:
            temp.fields[i].type = 'checkbox';
            temp.fields[i].truestate = temp.fields[i].options[0].toLowerCase().split(' ').join('_');

            temp.fields[i].widgetType = 'checkbox';
            break;
          case 3:
          case 4:
            temp.fields[i].type = 'radio';
            temp.fields[i].widgetType = 'select';
            break;
          default:
            temp.fields[i].type = 'select';
            temp.fields[i].widgetType = 'select';
        }

              }else{
                temp.fields[i].widgetType = 'textbox';
              }
              break;
          }
        }else{
          temp.fields[i].widgetType = 'textbox';
        }
      }
      //cb.load(temp.fields);
      cb.collections[0].load(temp.fields);
    }else{
      // cb.load(JSON.parse(($.jStorage.get('form') || "{}")));

      cb.collections[0].load(JSON.parse(($.jStorage.get('form') || "{}")));
    }

});




document.addEventListener('DOMContentLoaded', function(){

  editor = ace.edit("schema_editor");
  editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setTabSize(2);
  editor.getSession().on('change', function(e) {
    try {
      forms[form] = JSON.parse(editor.getValue());
      for(var i in Berry.instances){
        Berry.instances[i].destroy();
      }
      $('.target').berry(
        $.extend({autoFocus: false, actions: ['save'], name: 'myForm', attributes: QueryStringToHash(document.location.hash.substr(1) || "") }, forms[form] ) )
      .delay('change', function(){
        $('.result').html("<pre>"+JSON.stringify(this.toJSON(), undefined, "\t")+"</pre>");
      }, true)
      .on('save', function(){
        if(this.validate()) { location.hash = '#'+$.param(this.toJSON());}}
      );
    } catch (e) {
      return false;
    }
  });

  forms['builder'] = JSON.parse(($.jStorage.get('form') || "{}"));
  for(var i in forms['builder']){
    delete forms['builder'][i].widgetType;
  }

  form = (urlParams['demo'] || 'example');

  setSchema(forms[form])
});


function setSchema(obj){
  forms[form] = obj;
  for(var i in forms[form].fields){
    delete forms[form].fields[i].widgetType;
  }
  editor.setValue(JSON.stringify(forms[form], undefined, "\t"));
}

//data
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
