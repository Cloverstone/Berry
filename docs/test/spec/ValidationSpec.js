describe('Validation - Required', function () {
  var myBerry;

	beforeEach(function() {
    triggerOnChange = jasmine.createSpy('onChange');
		myBerry = new Berry({fields:{
      text: {required: true},
      textarea: {type: 'textarea', required: true},
      checkbox:{type: 'checkbox', required: true},
      select:{type: 'select', required: true, options:['First', 'Second']},
      radio:{type: 'radio', required: true, options:['First', 'Second']}
    }}, $('#berry')).on('change', triggerOnChange);
	});

  afterEach(function() {
    myBerry.destroy();
  });

  it('"Text" should be invalid if value is empty', function () {
    Berry.prototype.validateItem.call(myBerry.fields.text)
    expect(myBerry.valid ).toEqual(false);
  });
  it('"Text" should be valid if it contains any text', function () {
    myBerry.fields.text.setValue('text');
    Berry.prototype.validateItem.call(myBerry.fields.text)
    expect(myBerry.valid).toEqual(true);
  });

  it('"Textarea" should be invalid if value is empty', function () {
    Berry.prototype.validateItem.call(myBerry.fields.textarea)
    expect(myBerry.valid ).toEqual(false);
  });

  it('"Textarea" should be valid if it contains any text', function () {
    myBerry.fields.textarea.setValue('textarea');
    Berry.prototype.validateItem.call(myBerry.fields.textarea)
    expect(myBerry.valid).toEqual(true);
  });



  it('"Checkbox" should be invalid if value is falsey', function () {
    Berry.prototype.validateItem.call(myBerry.fields.checkbox)
    expect(myBerry.valid ).toEqual(false);
  });
  it('"Checkbox" should be valid if value is truthy', function () {
    myBerry.fields.checkbox.setValue(true);
    Berry.prototype.validateItem.call(myBerry.fields.checkbox)
    expect(myBerry.valid).toEqual(true);
  });

  it('"Select" should be invalid if value not selected', function () {
    Berry.prototype.validateItem.call(myBerry.fields.select)
    expect(myBerry.valid).toEqual(false);
  });

  it('"Select" should be valid if value selected', function () {
    myBerry.fields.select.set('Second');
    Berry.prototype.validateItem.call(myBerry.fields.select)
    expect(myBerry.valid).toEqual(true);
  });

  it('"Radio" should be invalid if value not selected', function () {
    Berry.prototype.validateItem.call(myBerry.fields.radio)
    expect(myBerry.valid).toEqual(false);
  });

  it('"Radio" should be valid if value selected', function () {
    myBerry.fields.radio.set('Second');
    Berry.prototype.validateItem.call(myBerry.fields.radio)
    expect(myBerry.valid).toEqual(true);
  });

});