define([], function () {

  /**
   * A Checkbox replacement that will use custom graphics.
   *
   * @constructor
   * @param {HTMLElement} node The node of the checkbox
   * @param {Object} farbs The farbs object
   */
  function Checkbox (node, farbs) {
    this.domNode = node;
    this.farbs = farbs;

    this.connect();
  }

  Checkbox.prototype = {

    /**
     * The DOMNode of the checkbox
     */
    domNode: null,

    /**
     * The name of a method to be called on change.
     * This is passed in via the data-farbs_onchange element attribute.
     */
    onchange: null,

    /**
     * Runs necessary connections
     */
    connect: function () {
      this.domNode.addEventListener('change', this.changeHandler.bind(this), false);
    },

    changeHandler: function () {
      // lookup the method in farbs' method registry:
      var callback = this.farbs.methodRegistry[this.onchange];

      // if it exists, let's call it:
      callback && callback(this);
    }


  };

  return Checkbox;

});
