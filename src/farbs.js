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
    version: '0.3.0',

    /**
     * The attribute name farbs uses.
     */
    attributeName: 'farbs',

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
      var listeners = this.listeners[topic] || (this.listeners[topic] = []);
      listeners.push(callback);
    },

    /**
     * Unsubscribes a listener from a topic.
     *
     * @param {string} topic The topic
     * @param {Function} callback The listener
     */
    unsubscribe: function (topic, callback) {
      var listeners = this.listeners[topic];
      if (!listeners) {
        return;
      }
      for (var i = listeners.length - 1; i >= 0; i--) {
        if (listeners[i] === callback) {
          listeners.splice(i, 1);
        }
      }
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
      var attributeName = farbs.attributeName,
          typeString = 'type',
          typeAttribute = attributeName + '_' + typeString,
          attributeNameLength = attributeName.length;

      [].slice.call(parentNode.querySelectorAll('[data-' + typeAttribute + ']')).forEach(function (node) {

        var type = node.dataset[typeAttribute],
            ctor = farbs.classRegistry[type];

        if (!ctor) {
          return;
        }

        if (!node.id) {
          node.id = '_' + attributeName + '_widget_' + _uid++;
        }
        var inst = new ctor(node, farbs);

        for (var key in node.dataset) {
          if (key.slice(0, attributeNameLength) == attributeName) {
            var propname = key.slice(attributeNameLength + 1);
            if (propname != typeString) {
              inst[propname] = node.dataset[key];
            }
          }
        }
        farbs.registerInstance(node.id, inst);
      });
    }

  };

  var _uid = 0;

  return farbs;

});
