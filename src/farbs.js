/**
 * @license farbs - A Framework Agnostic Registry Based Skeleton for decoupled
 *  UI components
 * Copyright (c) 2013 Jens Arps
 * http://jensarps.de/
 *
 * Licensed under the MIT (X11) license
 */
define(function () {

  /**
   * The farbs object.
   *
   * @type {Object}
   * @exports farbs
   * @version 0.2
   */
  var farbs = {

    /**
     * The version of this farbs object.
     */
    version: '0.2.0',

    /**
     * The class registry.
     *
     * Use this to get access to classes.
     */
    classRegistry: {},

    /**
     * The instance registry.
     *
     * Use this to get access to instances of, e.g. UI widgets.
     */
    instRegistry: {},

    /**
     * The method registry.
     *
     * Use this to get access to methods.
     */
    methodRegistry: {},

    /**
     * Holds listeners for pub/sub mechanism.
     */
    listeners: {},

    /**
     * Registers a class for later use.
     *
     * @param {string} id The id (== class name) to register the class with
     * @param {Object} ctor The class to register
     */
    registerClass: function (id, ctor) {
      this.classRegistry[id] = ctor;
    },

    /**
     * Registers an instance of a class.
     *
     * @param {string} id The id to register the instance with
     * @param {Object} inst The instance to register
     */
    registerInstance: function (id, inst) {
      this.instRegistry[id] = inst;
    },

    /**
     * Registers a method.
     *
     * @param {string} id The id of the method to register
     * @param {Function} func The method to register
     */
    registerMethod: function (id, func) {
      this.methodRegistry[id] = func;
    },

    /**
     * Publishes a topic to registered listeners
     *
     * @param {string} topic The topic
     * @param {*} [data] The data to pass to listeners
     */
    publish: function (topic, data) {
      if (!this.listeners[topic]) {
        return;
      }
      this.listeners[topic].forEach(function (callback) {
        callback(data);
      });
    },

    /**
     * Subscribes a listener to a topic.
     *
     * @param {string} topic The topic
     * @param {Function} callback The listener
     */
    subscribe: function (topic, callback) {
      if (!this.listeners[topic]) {
        this.listeners[topic] = [];
      }
      this.listeners[topic].push(callback);
    },

    /**
     * Unsubscribes a listener from a topic.
     *
     * @param {string} topic The topic
     * @param {Function} callback The listener
     */
    unsubscribe: function (topic, callback) {
      if (!this.listeners[topic]) {
        return;
      }
      var listeners = this.listeners[topic];
      listeners.forEach(function (listener, index) {
        if (listener === callback) {
          listeners.splice(index, 1);
        }
      });
    },

    /**
     * Parses a DOM (Sub-)Tree and instantiates classes for nodes containing
     * a data-farbs_type attribute. Will register instances in farbs.instRegistry.
     *
     * @param {HTMLElement} [parentNode] The node in the tree to begin parsing
     *  at. Optional.
     */
    parse: function (parentNode) {
      parentNode = parentNode || document.documentElement;
      var hits = parentNode.querySelectorAll('[data-farbs_type]');

      for(var i = 0, m = hits.length; i < m; i++) {
        var node = hits[i],
            type = node.dataset.farbs_type,
            ctor = farbs.classRegistry[type];

        if (!ctor) {
          return;
        }

        if (!node.id) {
          node.id = '_farbs_widget_' + _uid++;
        }
        var inst = new ctor(node, farbs);

        for (var key in node.dataset) {
          if(key.slice(0,5) == 'farbs'){
            var propname = key.slice(6);
            if (propname != 'type') {
              inst[propname] = node.dataset[key];
            }
          }
        }
        farbs.registerInstance(node.id, inst);
      }
    }

  };

  var _uid = 0;

  return farbs;

});
