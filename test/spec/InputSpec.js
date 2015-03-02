describe('Text Input', function () {
	var myBerry;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
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
		expect(myBerry.toJSON('test')).toEqual('hello');
    myBerry.fields.test.set('test');
    expect(myBerry.fields.test.value).toEqual('test');
  });

	it('sets value with set - get value from name', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
		myBerry.fields.test.set('test');
		expect(myBerry.toJSON('test')).toEqual('test');
	});
  
  it('sets value with set - get value from form toJSON', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
    myBerry.fields.test.set('test');
    expect(myBerry.toJSON()).toEqual({test: 'test'});
  });

	it('sets value with setValue', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
		myBerry.fields.test.setValue('test');
		expect(myBerry.fields.test.value).toEqual('test');
	});

  it('sets value with setValue - get value from name', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
    myBerry.fields.test.setValue('test');
    expect(myBerry.toJSON('test')).toEqual('test');
  })

  it('sets value with setValue - get value from toJSON', function () {
		expect(myBerry.toJSON('test')).toEqual('hello');
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

  it('should load choices from function', function () {

    myBerry.destroy();
    myBerry = new Berry({fields:{
      Title: {name: 'test', label: 'Label Field', type: 'select', reference: 'name',key: 'label', choices: function(){
        return [{"label":"Title","name":"second"},{"label":"Top Right","name":"topright"},{"label":"Bottom Right","name":"bottomright"},{"label":"Bottom Left","name":"bottomleft"},{"label":"Top Left","name":"topleft"}];
      }}}
    }, $('#berry'));
    expect($('select[name=test] option')[0]).toBeDefined();
  });


});