$(function(){
	cobler.register({
		type: 'select',
    category: 'form',
		icon: 'sort',
		display: 'Multiple Choice',
		defaults: {
			label: 'Label',
			type: 'select',
			required : false,
			help: '',
			useName : true
		},
		toJSON: function(){
			cobler.slice.prototype.toJSON.call(this);
			this.attributes = Berry.processOpts(this.attributes);
			this.attributes.name = this.attributes.name || this.attributes.label;
			return this.attributes;
		},
		fields: [
			{type: 'fieldset',name:'basics', legend: '<i class="fa fa-th"></i> Basics',inline: true, fields:[
				{type: 'text', label: 'Field Label', name: 'label', value: 'Label'},
				{type: 'select', label: 'Display', name: 'type', value: 'dropdown', choices: [
					{name: 'Dropdown', value: 'select'},
					{name: 'Radio', value: 'radio'}
				]},
				{type: 'checkbox', label: 'Required', name: 'required', inline: false},
				{type: 'textarea', label: 'Help Text', name: 'help'},
				{type: 'text', label: 'Value', name: 'value'},
			]},
			{type: 'fieldset',name:'choices_c', legend: '<i class="fa fa-th-list"></i> Choices', inline: true, fields:[
				{type: 'fieldset', label: false, legend: '<i class="fa fa-square"></i> Choices', multiple: {duplicate: true}, name: 'choices_list', toArray: true, fields: [
					{type: 'text', label: 'Choice', name: 'choices', toArray: true},
				]},
			]}
		],
		template: function(){
			return 'berry_' + this.attributes.type;
		}
	});
});