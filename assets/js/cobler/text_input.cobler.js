$(function(){
	cobler.register({
		type: 'textbox',
		category: 'form',
		icon: 'font',
		display: 'Text',
		defaults: {
			label: 'Label',
			type: 'text',
			required: false,
			help: ''
		},
		toJSON: function(){
			cobler.slice.prototype.toJSON.call(this);
			this.attributes.name = this.attributes.name || this.attributes.label;
			return this.attributes;
		},
		fields: [
			{type: 'text', label: 'Field Label', name: 'label', value: 'Label'},
			{type: 'select', label: 'Display', name: 'type', value: 'dropdown', 'choices': [
				{label: 'Single Line', value: 'text'},
				{label: 'Multi-line', value: 'textarea'},
				{label: 'Phone', value: 'phone'},
				{label: 'Email', value: 'email'},
				{label: 'Date', value: 'date'},
				{label: 'Number', value: 'number'}
			]},
			{type: 'text', label: 'Placeholder', name: 'placeholder'},
			{type: 'text', label: 'Value', name: 'value'},
			{type: 'text', label: 'Name', name: 'name'},
			{type: 'checkbox', label: 'Required', name: 'required', inline: false},
			{type: 'textarea', label: 'Instructions', name: 'help'},
		],
		template:  function(){
			return 'berry_' + this.attributes.type;
		}
	});
});