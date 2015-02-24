describe('Checkbox Input', function () {
  var myBerry;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
		myBerry = new Berry({fields:{test:{type: 'checkbox'}}}, $('#berry')).on('change:test', triggerOnChange);
	});

  afterEach(function() {
    myBerry.destroy();
  });

  it('should create a checkbox correctly', function () {
    expect($('input[name=test]')[0]).toBeDefined();
  });

	it('should return expected json', function () {
  	expect(myBerry.toJSON()).toEqual({test: false});
	});

	it('should return expected value', function () {
		expect(myBerry.toJSON('test')).toEqual(false);
	});

  it('should return expected value from mapped field', function () {
    expect(myBerry.fields.test.value).toEqual(false);
  });

	it('sets value with set', function () {
    expect(myBerry.toJSON('test')).toEqual(false);
		myBerry.fields.test.set(true);
		expect(myBerry.fields.test.value).toEqual(true);
	});

  it('sets value with set - get value from name', function () {
    expect(myBerry.toJSON('test')).toEqual(false);
    myBerry.fields.test.set(true);
    expect(myBerry.toJSON('test')).toEqual(true);
  });

  it('sets value with set', function () {
    expect(myBerry.fields.test.value).toEqual(false);
    myBerry.fields.test.set(true);
    expect(myBerry.toJSON()).toEqual({test: true});
  });
 
	it('sets value with setValue', function () {
    expect(myBerry.fields.test.value).toEqual(false);
		myBerry.fields.test.setValue(true);
		expect(myBerry.fields.test.value).toEqual(true);
	});

  it('sets value with set - get value from name', function () {
    expect(myBerry.toJSON('test')).toEqual(false);
    myBerry.fields.test.setValue(true);
    expect(myBerry.toJSON('test')).toEqual(true);
  });

  it('sets value with setValue', function () {
    expect(myBerry.fields.test.value).toEqual(false);
    myBerry.fields.test.setValue(true);
    expect(myBerry.toJSON()).toEqual({test: true});
  });

  it('should trigger events', function () {
    myBerry.fields.test.set(false);
    expect(triggerOnChange).not.toHaveBeenCalled();
    myBerry.fields.test.set(true);
    expect(triggerOnChange).toHaveBeenCalled();
  });

  it('should suppress change event during setValue', function () {
    myBerry.fields.test.setValue(true);
    expect(triggerOnChange).not.toHaveBeenCalled();
  });

  it('should allow alternate truestate', function () {

    expect(myBerry.toJSON('test')).toEqual(false);

    myBerry.fields.test.setValue(true);
    expect(myBerry.toJSON()).toEqual({test: true});
    myBerry.fields.test.truestate = 'on';
    expect(myBerry.toJSON('test')).toEqual('on');

    myBerry.fields.test.setValue('off');
    expect(myBerry.toJSON('test')).toEqual(false);
    
    myBerry.fields.test.setValue('on');
    expect(myBerry.fields.test.value).toEqual('on');
    expect(myBerry.toJSON('test')).toEqual('on');

    myBerry.fields.test.set('off');
    expect(myBerry.toJSON('test')).toEqual(false);

    myBerry.fields.test.set('on');
    expect(myBerry.toJSON('test')).toEqual('on');
    expect(myBerry.toJSON()).toEqual({test:'on'});

  });
});