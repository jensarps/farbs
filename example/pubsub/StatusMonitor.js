define([], function () {

  function StatusMonitor (node, farbs) {
    this.domNode = node;
    this.farbs = farbs;

    this.changeSubscriber = this.onChangeMonitored.bind(this);
    farbs.subscribe('/Checkbox/change', this.changeSubscriber);
  }

  StatusMonitor.prototype = {

    /**
     * The DOMNode of the checkbox
     */
    domNode: null,

    onChangeMonitored: function (payload) {
      var type = payload[0],
          value = payload[1]
      this.domNode.innerHTML += '<p>Change monitored. Type: ' + type + ', new value is: ' + value + '</p>';
    },

    destroy: function () {
      // don't forget to unsubscribe when you destroy a widget
      this.farbs.unsubscribe('/Checkbox/change', this.changeSubscriber);
    }

  };

  return StatusMonitor;

});
