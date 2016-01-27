Berry
======

###What?

Berry is a comprehensive form library that aims to make form creation, usage and maintanance easier for developers. This is done by allowing a simple JSON definition to define the display, validation, conditions and initial values of the form. A simple api is then provided to facilitate updating and parsing the data back out of the form with events and callbacks provided.

###Why?
* Get JSON representation of form data directly
* Consistancy
* Bind data to your form to populate
* Not reinventing the wheel every time you want to do complex forms
* Change between element types by just changing the type not all related html i.e radio to select
* [Tests](http://cloverstone.github.io/Berry/test/SpecRunner.html)
* Build a form with a [GUI](http://cloverstone.github.io/Berry/editor.html)

http://localhost/Berry/sandbox.html
###Powerful features
* Built in duplication of fields
* Conditionally display fields
* Validation
* Multiple rendering types (wizard, tabs, normal)
* Custom Form elements
* Load field options from JSON source
* [Many more!](http://cloverstone.github.io/Berry/docs.html)

###Very basic example
```js
options = {      
	"attributes": {"first_name": "John", "name_last": "Doe"},
	"fields":[
		{"label": "First Name"}, 
		{"label": "Last Name", "name": "name_last"},
		{"label": "Age", "type": "number"},
		{"label": "Favorite Color", "type": "color"}
	]
};
$('.myForm').berry(options);
```

####See it live [here](http://cloverstone.github.io/Berry/sandbox.html)

======
Berry is also built very modulerly, each field type is defined independently and allows for custom types to be created including types with no html spec analog if desired. The theme is completely separated out as well meaning themes could be created for any popular framework or custom for your own project. Also the way the form is rendered is modular, allowing the same definition to be rendered as a set of fieldsets, a table, tabs by fieldset, or a wizard by fieldset and more could be created as needed. Additionally the framework is able to be extended without modifying the main code, included are three example of this: creating the form in a modal by simply not passing a target, tying the form to a backbone model by passing a model with a schema defined for the form allowing for auto syncing and populating, and the third is a way to derive the fiels form a modified mustache template.

There is documentation, an editor for building forms and examples [here](http://cloverstone.github.io/Berry). 

Tests can be run [here](http://cloverstone.github.io/Berry/test/SpecRunner.html)

Contact me if you are interested in contributing or giving any kind of feedback.

####ToDo

* Try to remove dependence on jQuery
* Support for other common css frameworks
