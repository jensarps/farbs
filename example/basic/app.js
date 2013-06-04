require(['../../src/farbs', 'Checkbox'], function (farbs, Checkbox) {

  farbs.registerClass('Checkbox', Checkbox);

  var onMyCheckboxChange = function (inst) {
    var currentState = inst.domNode.checked ? 'checked' : 'unchecked';
    alert('Changed! New value: ' + currentState);
  };
  farbs.registerMethod('onMyCheckboxChange', onMyCheckboxChange);

  farbs.parse();

});
