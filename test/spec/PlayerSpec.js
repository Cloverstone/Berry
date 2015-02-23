describe('Berry Initialization', function () {
	var myBerry;

	beforeEach(function() {
		myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
	});

	it('should create a form', function () {
		expect($('form')[0]).toBeDefined();
	});

	it('should create actions correctly', function () {
		expect($('[data-id=berry-submit]')[0]).toBeDefined();
		expect($('[data-id=berry-close]')[0]).toBeDefined();
	});

	it('should create a global reference', function () {
		expect(Berry.instances.b0).toBeDefined();
	});

	it('should create field reference', function () {
		expect(myBerry.fields.test).toBeDefined();
		expect(myBerry.fields.test).toEqual(jasmine.any(Berry.field));
	});

	it('returns expected json', function () {
		expect(myBerry.toJSON()).toEqual({test: 'hello'});
	});

});
describe('Text Input', function () {
	var myBerry;

	beforeEach(function() {
		myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
	});

	it('should create an input correctly', function () {
		expect($('input[name=test]')[0]).toBeDefined();
	});

	it('should return expected json', function () {
		expect(myBerry.toJSON()).toEqual({test: 'hello'});
	});

	it('should return expected value', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
	});

	it('sets value with set', function () {
		myBerry.fields.test.set('test');
		expect(myBerry.fields.test.value).toEqual('test');
		expect(myBerry.toJSON('test')).toEqual('hello');
		expect(myBerry.toJSON()).toEqual({test: 'test'});
	});

	it('sets value with setValue', function () {
		myBerry.fields.test.setValue('test');
		expect(myBerry.fields.test.value).toEqual('test');
		expect(myBerry.toJSON()).toEqual({test: 'test'});
	});

});

describe('Hidden Input', function () {
	var myBerry;

	beforeEach(function() {
		myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
	});

	it('should create a hidden input correctly', function () {
		myBerry = new Berry({fields:{test:{value: 'hello', type: 'hidden'}}}, $('#berry'));
		expect($('input[name=test]')[0]).toBeDefined();
	});

});

describe('Select Input', function () {
	var myBerry;

	beforeEach(function() {
		myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
	});

});

describe('Radio Input', function () {
	var myBerry;

	beforeEach(function() {
		myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
	});

});

describe('Checkbox Input', function () {
	var myBerry;

	beforeEach(function() {
		myBerry = new Berry({attributes:{test: 't'},fields:{test:{type: 'checkbox', truestate: 't'}}}, $('#berry'));
	});

	it('should create a checkbox correctly', function () {
		expect($('input[name=test]')[0]).toBeDefined();
	});
});

describe('Berry in action', function () {
	var myBerry;

	beforeEach(function() {
		myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
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