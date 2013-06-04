require(['../../src/farbs', 'Checkbox'], function (farbs, Checkbox) {

  farbs.registerClass('Checkbox', Checkbox);

  var onMyCheckboxChange = function () {
    alert('changed!');
  };
  farbs.registerMethod('onMyCheckboxChange', onMyCheckboxChange);

  farbs.parse();

});
