describe('Berry Initialization', function () {
	var myBerry;

	beforeEach(function() {
		myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
	});

	it('creates a form', function () {
		expect($('form')[0]).toBeDefined();
	});

	it('creates an input correctly', function () {
		expect($('input[name=test]')[0]).toBeDefined();
	});

	it('creates field reference', function () {
		expect(myBerry.fields.test).toBeDefined();
		expect(myBerry.fields.test).toEqual(jasmine.any(Berry.field));
	});
});
describe('Berry in action', function () {
	var myBerry;

	beforeEach(function() {
		myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
	});

	it('returns expected json', function () {
		expect(myBerry.toJSON()).toEqual({test: 'hello'});
	});

	it('sets value with set', function () {
		myBerry.fields.test.set('test');
		expect(myBerry.fields.test.value).toEqual('test');
		expect(myBerry.toJSON()).toEqual({test: 'test'});
	});

	it('sets value with setValue', function () {
		myBerry.fields.test.setValue('test');
		expect(myBerry.fields.test.value).toEqual('test');
		expect(myBerry.toJSON()).toEqual({test: 'test'});
	});

	it('will handle null attributes', function () {
		myBerry = new Berry({attributes: {test: null}, fields:{test:{value: null}}}, $('#berry'));
		expect(myBerry.fields.test.value).toEqual('');
		expect(myBerry.toJSON()).toEqual({test: ''});

		myBerry = new Berry({attributes: {test: null}, fields:{test:{type: 'select', choices: ['hello', 'stuff'],value: null }}}, $('#berry'));
		expect(myBerry.toJSON()).toEqual({test: 'hello'});
	});

	it('returns expected json - select default', function () {
		myBerry = new Berry({fields:{test:{type: 'select', choices: ['hello', 'stuff'] }}}, $('#berry'));
		expect(myBerry.toJSON()).toEqual({test: 'hello'});
	});

	it('returns expected json - select w/ default value', function () {
		myBerry = new Berry({fields:{test:{type: 'select', value:'stuff', choices: ['hello', 'stuff'] }}}, $('#berry'));
		expect(myBerry.toJSON()).toEqual({test: 'stuff'});
	});

});