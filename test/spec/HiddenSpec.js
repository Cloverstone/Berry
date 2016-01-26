describe('Hidden Input', function () {
	var myBerry;

  afterEach(function() {
    myBerry.destroy();
  });

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
		myBerry = new Berry({fields:{test:{value: 'hello', type: 'hidden'}}}, $('#berry')).on('change:test', triggerOnChange);;
	});

	it('should create a hidden input correctly', function () {
    expect($('input[type=hidden][name=test]')[0]).toBeDefined();
	});

  it('should return expected json', function () {
    expect(myBerry.toJSON()).toEqual({test: 'hello'});
  });

  it('should return expected value', function () {
    expect(myBerry.toJSON('test')).toEqual('hello');
  });

  it('sets value with set', function () {
    expect(myBerry.toJSON()).toEqual({test: 'hello'});
    myBerry.fields.test.set('test');
    expect(myBerry.fields.test.value).toEqual('test');
  });
  
  it('sets value with set - get value from name', function () {
    expect(myBerry.toJSON()).toEqual({test: 'hello'});
    myBerry.fields.test.set('test');
    expect(myBerry.toJSON('test')).toEqual('test');
  });

  it('sets value with set - get value from form toJSON', function () {
    expect(myBerry.toJSON()).toEqual({test: 'hello'});
    myBerry.fields.test.set('test');
    expect(myBerry.toJSON()).toEqual({test: 'test'});
  });

  it('sets value with setValue', function () {
    expect(myBerry.toJSON()).toEqual({test: 'hello'});
    myBerry.fields.test.setValue('test');
    expect(myBerry.fields.test.value).toEqual('test');
  });

  it('sets value with setValue - get value from form name', function () {
    expect(myBerry.toJSON()).toEqual({test: 'hello'});
    myBerry.fields.test.setValue('test');
    expect(myBerry.toJSON('test')).toEqual('test');
  });

  it('sets value with setValue - get value from form toJSON', function () {
    expect(myBerry.toJSON()).toEqual({test: 'hello'});
    myBerry.fields.test.setValue('test');
    expect(myBerry.toJSON()).toEqual({test: 'test'});
  });

  it('should trigger events', function () {
    myBerry.fields.test.set('hello');
    expect(triggerOnChange).not.toHaveBeenCalled();
    myBerry.fields.test.set('test');
    expect(triggerOnChange).toHaveBeenCalled();
  });

  it('should suppress change event during setValue', function () {
    myBerry.fields.test.setValue('test');
    expect(triggerOnChange).not.toHaveBeenCalled();
  });

});