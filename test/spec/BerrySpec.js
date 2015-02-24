describe('Berry Initialization', function () {
	var myBerry;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy();
		myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry')).on('change', triggerOnChange);
	});

  afterEach(function() {
    myBerry.destroy();
  });

  it('should create a global reference', function () {
    expect(Berry.instances.b0).toBeDefined();
  });

  it('should be defined', function () {
    expect(myBerry).toBeDefined();
  });

	it('should create a form', function () {
		expect($('form')[0]).toBeDefined();
	});

	it('should create actions correctly', function () {
		expect($('[data-id=berry-submit]')[0]).toBeDefined();
		expect($('[data-id=berry-close]')[0]).toBeDefined();
	});

	it('should create field reference', function () {
		expect(myBerry.fields.test).toBeDefined();
		expect(myBerry.fields.test).toEqual(jasmine.any(Berry.field));
	});

	it('should return expected json', function () {
		expect(myBerry.toJSON()).toEqual({test: 'hello'});
	});

  it('should have events', function () {
    myBerry.trigger('change');
    expect(triggerOnChange).toHaveBeenCalled();
  });
});



describe('Berry in action', function () {
	var myBerry;

	beforeEach(function() {
		//myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
	});

  afterEach(function() {
    myBerry.destroy();
  });

	it('will handle null attributes', function () {
		myBerry = new Berry({attributes: {test: null}, fields:{test:{value: null}}}, $('#berry'));
		expect(myBerry.fields.test.value).toEqual('');
		expect(myBerry.toJSON()).toEqual({test: ''});
		myBerry.destroy();

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

// describe('Select Input', function () {
//   var myBerry;

//   beforeEach(function() {
//     myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
//   });
// });

// describe('Radio Input', function () {
//   var myBerry;

//   beforeEach(function() {
//     myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'));
//   });
// });