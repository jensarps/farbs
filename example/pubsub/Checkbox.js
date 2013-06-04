define([], function () {

  function Checkbox (node, farbs) {
    this.domNode = node;
    this.farbs = farbs;

    this.domNode.addEventListener('change', this.changeHandler.bind(this), false);
  }

  Checkbox.prototype = {

    domNode: null,

    changeHandler: function () {
      this.farbs.publish('/Checkbox/change', ['checkbox', this.domNode.checked]);
    }


  };

  return Checkbox;

});
