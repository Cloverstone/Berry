$(function(){
	cobler.register({
		type: 'checkbox',
    category: 'form',
		icon: 'check-square-o',
		display: 'Checkbox',
		defaults: {
			label: 'Label',
			type: 'text',
			placeholder: '',
			help: ''
		},
		fields: [
			{type: 'text', label: 'Label', name: 'label', value: 'Label'},
			{type: 'select', label: 'Display', name: 'type', value: 'dropdown', 'choices': [
				{label: 'Basic', value: 'base'},
				{label: 'Collection', value: 'collection'},
			]},
			{type: 'textarea', label: 'Help Text', name: 'help'},
		],
		template:  function(){
			return 'berry_checkbox';
		}
	});
});