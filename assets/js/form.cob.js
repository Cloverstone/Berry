Cobler.types.textbox = {
	render: function(item){
		if(item.type == 'textarea'){
			return templates['berry_textarea'].render(item, templates);
		}
		return templates['berry_text'].render(item, templates);
	},
	default: {
			widgetType: 'textbox',
			type: 'text',
			label: 'Label'
		},
	fields: [
		{type: 'text', required: true, label: 'Field Label', name: 'label'},
		{type: 'text', label: 'Name', name: 'name'},
		{type: 'select', label: 'Display', name: 'type', value: 'dropdown', 'choices': [
			{label: 'Single Line', value: 'text'},
			{label: 'Multi-line', value: 'textarea'},
			{label: 'Phone', value: 'phone'},
			{label: 'Email', value: 'email'},
			{label: 'Date', value: 'date'},
			{label: 'Number', value: 'number'},
			{label: 'Color', value: 'color'}
		]},
		{type: 'text', label: 'Placeholder', name: 'placeholder'},
		{type: 'text', label: 'Default value', name: 'value'},
		{type: 'textarea', label: 'Instructions', name: 'help'},
		{type: 'checkbox', label: 'Required', name: 'required'},
	]
};

Cobler.types.select = {
	render: function(item){
		return templates['berry_' + item.type].render(item, templates);
	},
	default: {
			widgetType: 'select',
			type: 'select',
			label: 'Label'
		},
	fields: [
		{type: 'fieldset', name:'basics', legend: '<i class="fa fa-th"></i> Basics', hideLabel: true, inline: true, fields:[
			{type: 'text', required: true, label: 'Field Label', name: 'label'},
			{type: 'text', label: 'Name', name: 'name'},
			{type: 'select', label: 'Display', name: 'type', value: 'dropdown', choices: [
				{name: 'Dropdown', value: 'select'},
				{name: 'Radio', value: 'radio'},
				{name: 'Range', value: 'range'}
			]},
			{type: 'text', label: 'External List', name: 'choices'},

			{type: 'text', label: 'Label-key', name: 'label_key'},
			{type: 'text', label: 'Value-key', name: 'value_key'},

			{type: 'text', label: 'Default Value', name: 'value'},
			{type: 'number', label: 'Max', name: 'max'},
			{type: 'number', label: 'Min', name: 'min'},
			{type: 'number', label: 'Step', name: 'step'},
			{type: 'textarea', label: 'Instructions', name: 'help'},
			{type: 'checkbox', label: 'Required', name: 'required'},
		]},
		{type: 'fieldset', name:'choices_c', legend: '<i class="fa fa-th-list"></i> Choices', hideLabel: true,  inline: true, fields:[
			{type: 'fieldset', label: false, multiple: {duplicate: true}, name: 'options', fields: [
				{label: 'Label'},
				{label: 'Value'}
			]}
		]},
	]
}

Cobler.types.checkbox = {
	render: function(item){
		item.container = 'span';
		return templates['berry_checkbox'].render(item, templates);
	},
	default: {
			widgetType: 'checkbox',
			type: 'checkbox',
			container: 'span',
			label: 'Label'
		},
	fields: [
		{type: 'text', required: true, label: 'Field Label', name: 'label'},
		{type: 'text', label: 'Name', name: 'name'},
		{type: 'checkbox', label: 'Default Value', name: 'value'},
		{type: 'textarea', label: 'Instructions', name: 'help'},
		{type: 'checkbox', label: 'Required', name: 'required'},
	]
}