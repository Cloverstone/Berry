describe('Select Input', function () {
	var myBerry;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');

    myBerry = new Berry({fields:{test:{type: 'select', choices: ['hello', 'stuff'] }}}, $('#berry')).on('change:test', triggerOnChange);
//		myBerry = new Berry({fields:{test:{value: 'hello'}}}, $('#berry'))
	});

  afterEach(function() {
    myBerry.destroy();
  });

	it('should create a select input correctly', function () {
		expect($('select[name=test]')[0]).toBeDefined();
	});

	it('should return expected json', function () {
		expect(myBerry.toJSON()).toEqual({test: 'hello'});
	});

	it('should return expected value', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
	});

  it('sets value with set', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
    myBerry.fields.test.set('stuff');
    expect(myBerry.fields.test.value).toEqual('stuff');
  });

	it('sets value with set - get value from name', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
		myBerry.fields.test.set('stuff');
		expect(myBerry.toJSON('test')).toEqual('stuff');
	});
  
  it('sets value with set - get value from form toJSON', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
    myBerry.fields.test.set('stuff');
    expect(myBerry.toJSON()).toEqual({test: 'stuff'});
  });

	it('sets value with setValue', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
		myBerry.fields.test.setValue('stuff');
		expect(myBerry.fields.test.value).toEqual('stuff');
	});

  it('sets value with setValue - get value from name', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
    myBerry.fields.test.setValue('stuff');
    expect(myBerry.toJSON('test')).toEqual('stuff');
  })

  it('sets value with setValue - get value from toJSON', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
    myBerry.fields.test.setValue('stuff');
    expect(myBerry.toJSON()).toEqual({test: 'stuff'});
  });

  it('should trigger events', function () {
    myBerry.fields.test.set('hello');
    expect(triggerOnChange).not.toHaveBeenCalled();
    myBerry.fields.test.set('stuff');
    expect(triggerOnChange).toHaveBeenCalled();
  });

  it('should suppress change event during setValue', function () {
    myBerry.fields.test.setValue('stuff');
    expect(triggerOnChange).not.toHaveBeenCalled();
  });

});