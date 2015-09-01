describe('Berry Multiple', function () {
	var myBerry;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy();
		myBerry = new Berry({fields:
			[
				{
					"name": "fs_c",
					"type": "fieldset",
					"legend": "Favorite Candies",
					"fields": {
						"fs": {
							"label": false,
							"type": "fieldset",
							"multiple": {
								"duplicate": true,
								"max": 2
							},
							"toArray": true,
							"fields": {
								"Candy Type": {}
							}
						}
					}
				}
			]
		}, $('#berry')).on('change', triggerOnChange);

	});

  afterEach(function() {
    myBerry.destroy();
  });

	it('should create field reference', function () {
		expect(myBerry.fields.fs_c).toBeDefined();
		expect(myBerry.fields.fs_c.instances[0]).toEqual(jasmine.any(Berry.field));
	});

	it('should return expected json supplied', function () {
    myBerry.destroy();
		myBerry = new Berry({
			flatten: false,
			fields:
			[
				{
					"name": "candies",
					"type": "fieldset",
					"legend": "Favorite Candies",
					"fields": {
						"fs": {
							"label": false,
							"type": "fieldset",
							"fields": {
								"Candy Type": {}
							}
						}
					}
				}
			],
		'attributes': { candy_type: 'Stuff' }   }, $('#berry')).on('change', triggerOnChange);

		var actual = myBerry.options.attributes;//myBerry.toJSON()
		var expected = {candy_type: 'Stuff' };
		expect(actual).toEqual(expected);
	});

	it('should return expected json', function () {
		expect(myBerry.toJSON()).toEqual({candy_type: []});
	});



	it('should return expected json with multiple supplied', function () {
    myBerry.destroy();
		myBerry = new Berry({
			flatten: false,
			fields:
			[
				{
					"name": "candies",
					"type": "fieldset",
					"legend": "Favorite Candies",
					"fields": {
						"fs": {
							"label": false,
							"type": "fieldset",
							"multiple": {
								"duplicate": true,
								"max": 2
							},
							"toArray": true,
							"fields": {
								"Candy Type": {}
							}
						}
					}
				}
			],
		'attributes': { candies: { fs: { candy_type: ['Hello', 'Stuff'] } } }   }, $('#berry')).on('change', triggerOnChange);

		var actual = myBerry.toJSON()
		var expected = { candies: { fs: { candy_type: [ 'Hello' , 'Stuff' ] } } };
		expect(actual).toEqual(expected);
	});

	it('should return expected json with multiple supplied', function () {
    myBerry.destroy();
		myBerry = new Berry({
			flatten: false,
			fields: [
				{
					"name": "candies",
					"type": "fieldset",
					"legend": "Favorite Candies",
					"fields": {
						"fs": {
							"label": false,
							"type": "fieldset",
							"multiple": {
								"duplicate": true,
								"max": 2
							},
							"toArray": false,
							"fields": {
								"Candy Type": {}
							}
						}
					}
				}
			],
		'attributes': { candies: { fs: [ { candy_type: 'Kit Kat' }, { candy_type: 'Reases' } ] } } }, $('#berry')).on('change', triggerOnChange);

		expect(myBerry.toJSON()).toEqual({ candies: { fs: [ { candy_type: 'Kit Kat' }, { candy_type: 'Reases' } ] } });
	});

 //  it('should have triggerable events', function () {
 //    myBerry.trigger('change');
 //    expect(triggerOnChange).toHaveBeenCalled();
 //  });

 //  it('should allow attributes paramater', function () {
 //    myBerry.destroy();
 //    myBerry = new Berry({attributes: {test: 'hello'}, fields:{test:{}}}, $('#berry'));
 //    expect(myBerry.toJSON()).toEqual({test: 'hello'});
 //  });
});




// {
//   "attributes": {"test": [{
// 		"name": "dafasda",
// 		"title": "more",
// 		"candy": "Tuesday"
// 	},{
// 		"name": "dafasda",
// 		"title": "more",
// 		"candy": "Monday"
// 	}]},
// 	"fields": [
//     {"type":"fieldset","multiple":{"min":2}, "label":"Test", "fields":[
// 		{
// 			"label": "Name",
// 			"type": "text",
// 			"required": false,
// 			"name": "name"
// 		},
// 		{
// 			"label": "Title",
// 			"type": "text",
// 			"name": "title"
// 		},
// 		{
// 			"label": "Favorite Candy",
// 			"name": "candy",
// 			"type": "select",
// 			"value": "",
// 			"choices": "./data/days.json"
// 		}]}
// 	]
// }

// {
//   "attributes": {"test": {
// 		"name": "dafasda",
// 		"title": "more",
// 		"candy": "Tuesday"
// 	}},
// 	"fields": [
//     {"type":"fieldset", "label":"Test", "fields":[
// 		{
// 			"label": "Name"
// 		},
// 		{
// 			"label": "Title"
// 		},
// 		{
// 			"label": "Favorite Candy",
// 			"name": "candy",
// 			"type": "select",
// 			"choices": "./data/days.json"
// 		}]}
// 	]
// }