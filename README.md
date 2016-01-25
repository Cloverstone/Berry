Berry
======

###What?

Berry is a javascript library that aims to make form creation, usage and maintanance easier for developers. This is done by allowing a simple JSON definition to define the display, validation, conditions and initial values of the form. A simple api is then provided to facilitate updating and parsing the data back out of the form with events and callbacks provided.

###Why?

Berry tries to solve many of the problems that creating forms often comes with. Consistancy is one of the first problems Berry trys to solve, both when the same type us used multiple places as well as when different types are used. For example if you have two text boxs that you want to look the same the html is auto generated so you only need to fix/change it in the template that is used. Additionally since the format is similar for the different types, if you want to change a 'radio' to a 'select' type input you simply change the type in the definition, you don't need to go through each option and change the html. Many of these problems have been solved in different projects in different ways, Berry attempts to do this in a project agnostic way.

======

Berry is also built very modulerly, each field type is defined independently and allows for custom types to be created including types with no html spec analog if desired. The theme is completely separated out as well meaning themes could be created for any popular framework or custom for your own project. Also the way the form is rendered is modular, allowing the same definition to be rendered as a set of fieldsets, a table, tabs by fieldset, or a wizard by fieldset and more could be created as needed. Additionally the framework is able to be extended without modifying the main code, included are three example of this: creating the form in a modal by simply not passing a target, tying the form to a backbone model by passing a model with a schema defined for the form allowing for auto syncing and populating, and the third is a way to derive the fiels form a modified mustache template.


There is documentation, an editor for building forms and a few examples [here](http://cloverstone.github.io/Berry). I will attempt to improve all of that as time permits and depending on if people actually want to use it.

Tests can be run [here](http://cloverstone.github.io/Berry/test/SpecRunner.html)

I know this doesn't have every modern piece we expect from open source projects like ways to install or support for require or badges and stuff like that, but it works quite well and has been a huge time saver for me over the last few years and I don't have infinite time. So if you would like to contribute and help bring this up to modern expectations I would greatly appreciate that. However if you think this is garbage I really don't care to hear that.

##ToDo?

* Try to remove dependence on jQuery
* Support for other common css frameworks
* Full test coverage
* More