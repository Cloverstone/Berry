describe('Fieldset', function () {
	var myBerry;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
		myBerry = new Berry({fields:[{type: 'fieldset', name: 'first', fields: {test:{value: 'hello'} }}] }, $('#berry')).on('change:test', triggerOnChange);
	});

  afterEach(function() {
    myBerry.destroy();
  });

	it('should create a text input correctly', function () {
		expect($('input[name=test]')[0]).toBeDefined();
	});

	it('should return expected json', function () {
    var actual = myBerry.toJSON();
    var expected = {test: 'hello'};
		expect(actual).toEqual(expected);
	});

	it('should return expected value', function () {
    var actual = myBerry.toJSON('first.test');
    var expected = 'hello';
    expect(actual).toEqual(expected);
	});

  it('sets value with set', function () {
		expect(myBerry.toJSON('first.test')).toEqual('hello');
    myBerry.fields.first.instances[0].children.test.set('test');

    expect(myBerry.fields.first.instances[0].children.test.value).toEqual('test');
  });

	it('sets value with set - get value from name', function () {
		expect(myBerry.toJSON('first.test')).toEqual('hello');
		myBerry.fields.first.instances[0].children.test.set('test');
		expect(myBerry.toJSON('first.test')).toEqual('test');
	});
  
  it('sets value with set - get value from form toJSON', function () {
		expect(myBerry.toJSON('first.test')).toEqual('hello');
    myBerry.fields.first.instances[0].children.test.set('test');
    expect(myBerry.toJSON()).toEqual({test: 'test'});
  });

	it('sets value with setValue', function () {
		expect(myBerry.toJSON('first.test')).toEqual('hello');
		myBerry.fields.first.instances[0].children.test.setValue('test');
		expect(myBerry.fields.first.instances[0].children.test.value).toEqual('test');
	});

  it('sets value with setValue - get value from name', function () {
		expect(myBerry.toJSON('first.test')).toEqual('hello');
    myBerry.fields.first.instances[0].children.test.setValue('test');
    expect(myBerry.toJSON('first.test')).toEqual('test');
  })

  it('sets value with setValue - get value from toJSON', function () {
		expect(myBerry.toJSON('first.test')).toEqual('hello');
    myBerry.fields.first.instances[0].children.test.setValue('test');
    expect(myBerry.toJSON()).toEqual({test: 'test'});
  });

  it('should trigger events', function () {
    myBerry.fields.first.instances[0].children.test.set('hello');
    expect(triggerOnChange).not.toHaveBeenCalled();
    myBerry.fields.first.instances[0].children.test.set('test');
    expect(triggerOnChange).toHaveBeenCalled();
  });

  it('should suppress change event during setValue', function () {
    myBerry.fields.first.instances[0].children.test.setValue('test');
    expect(triggerOnChange).not.toHaveBeenCalled();
  });

});