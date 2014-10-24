//get attributes from hash array
var attributes = window.location.hash.replace('#', '').split('&').map(function(val){return val.split('=');}).reduce(function ( total, current ) {total[ current[0] ] = current[1];return total;}, {});

$('.form').berry({
	attributes: attributes,
	fields: [
		{name: 'name', label: 'Name'},
		{name: 'enabled', label: 'Enabled', type: 'checkbox'},
		{name: 'choose', label: 'Choose', type: 'radio', max: 5, min: 1, step: 2},
		{name: 'slot', label: 'Slot', type: 'select', choices: ['First', {name: 'Second', value: '2',}]},
	]
})
//This event is triggered when the field with the name 'name' changes
.on('change:name', function() {
	console.clear();
})
//This event is triggered when any field changes
.on('change', function() {
	console.log(this.toJSON());
})
//This even is triggered when the save button is clicked
.on('save', function() {
		//push the attributes to the hash to maintain across page refreshes
		window.location.hash = '#'+$.param(this.toJSON());
});