describe('Checkbox Input', function () {
  var myBerry;



	beforeEach(function() {
    triggerOnChange = jasmine.createSpy();
		myBerry = new Berry({fields:{test:{type: 'checkbox'}}}, $('#berry')).on('change:test', triggerOnChange);
	});

  afterEach(function() {
    myBerry.destroy();
  });

  it('should create a checkbox correctly', function () {
    expect($('input[name=test]')[0]).toBeDefined();
  });

	it('should return expected json', function () {
		debugger;
		expect(myBerry.toJSON()).toEqual({test: false});
	});


	it('should return expected value', function () {
		expect(myBerry.toJSON('test')).toEqual(false);
	});

	it('sets value with set', function () {
		myBerry.fields.test.set(true);
		expect(myBerry.fields.test.value).toEqual(true);
	});
 /* 
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
*/
  it('should trigger events', function () {
    myBerry.fields.test.set('test');
    expect(triggerOnChange).toHaveBeenCalled();
  });

});