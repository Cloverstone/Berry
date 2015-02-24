describe('Text Input', function () {
	var myBerry;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy();
		myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry')).on('change:test', triggerOnChange);
	});

  afterEach(function() {
    myBerry.destroy();
  });

	it('should create a text input correctly', function () {
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
	});
  
  it('sets value with set', function () {
    myBerry.fields.test.set('test');
    expect(myBerry.toJSON('test')).toEqual('hello');
  });

  it('sets value with set', function () {
    myBerry.fields.test.set('test');
    expect(myBerry.toJSON()).toEqual({test: 'test'});
  });

	it('sets value with setValue', function () {
		myBerry.fields.test.setValue('test');
		expect(myBerry.fields.test.value).toEqual('test');
	});

  it('sets value with setValue', function () {
    myBerry.fields.test.setValue('test');
    expect(myBerry.toJSON()).toEqual({test: 'test'});
  });

  it('should trigger events', function () {
    myBerry.fields.test.set('test');
    expect(triggerOnChange).toHaveBeenCalled();
  });
});