define([
  'intern!bdd',
  'intern/chai!expect',
  '../src/farbs'
], function (bdd, expect, farbs) {

  var opts = {}.toString;

  bdd.describe('The farbs module', function () {

    bdd.it('should return an object', function () {

      expect(opts.call(farbs)).to.equal('[object Object]');

    });

  });

  bdd.describe('registry ops', function () {

    [
      {
        registry: 'classRegistry',
        method: 'registerClass'
      },
      {
        registry: 'instRegistry',
        method: 'registerInstance'
      },
      {
        registry: 'methodRegistry',
        method: 'registerMethod'
      }

    ].forEach(function (registryType) {

        bdd.describe(registryType.registry, function () {

          bdd.it('should be an object', function () {

            expect(opts.call(farbs[registryType.registry])).to.equal('[object Object]');

          });

        });

        bdd.describe(registryType.method + '()', function () {

          bdd.beforeEach(function () {
            farbs[registryType.registry] = {};
          });

          bdd.it('should add anything at the given id to the registry', function () {

            var itemId = '__ITEM_ID',
                item = '__ITEM__';

            farbs[registryType.method](itemId, item);

            expect(farbs[registryType.registry][itemId]).to.equal(item);

          });

          bdd.it('should overwrite anything with the same id', function () {

            var itemId = '__ITEM_ID',
                item = '__ITEM__',
                item2 = '__ITEM2__';

            farbs[registryType.method](itemId, item);
            farbs[registryType.method](itemId, item2);

            expect(farbs[registryType.registry][itemId]).to.equal(item2);

          });

        });

      });

  });

  bdd.describe('pub/sub', function () {

    bdd.describe('listeners registry', function() {

      bdd.it('should be an object', function () {

        expect(opts.call(farbs.listeners)).to.equal('[object Object]');

      });

    });


    bdd.describe('subscribe()', function(){

      bdd.beforeEach(function () {
        farbs.listeners = {};
      });

      bdd.it('should create an array in the listeners object for the given topic', function(){

        var topic = '__TOPIC__',
            listener = '__LISTENER__';

        farbs.subscribe(topic, listener);

        expect(opts.call(farbs.listeners[topic])).to.equal('[object Array]');

      });

      bdd.it('should add the listener', function(){

        var topic = '__TOPIC__',
            listener = '__LISTENER__';

        farbs.subscribe(topic, listener);

        expect(farbs.listeners[topic][0]).to.equal(listener);

      });

      bdd.it('should add the listener only once', function(){

        var topic = '__TOPIC__',
            listener = '__LISTENER__';

        farbs.subscribe(topic, listener);

        expect(farbs.listeners[topic].length).to.equal(1);

      });

      bdd.it('should not overwrite an existing listener', function(){

        var topic = '__TOPIC__',
            listener = '__LISTENER__';

        farbs.subscribe(topic, listener);
        farbs.subscribe(topic, listener);

        expect(farbs.listeners[topic][0]).to.equal(listener);
        expect(farbs.listeners[topic][1]).to.equal(listener);

      });

    });

    bdd.describe('unsubscribe()', function(){

      bdd.beforeEach(function () {
        farbs.listeners = {};
      });

      bdd.it('should remove a listener', function(){

        var topic = '__TOPIC__',
            listener = '__LISTENER__';

        farbs.subscribe(topic, listener);

        farbs.unsubscribe(topic, listener);

        expect(farbs.listeners[topic].length).to.equal(0);

      });

      bdd.it('should not remove other listeners', function(){

        var topic = '__TOPIC__',
            listener = '__LISTENER__',
            listener2 = '__LISTENER2__',
            listener3 = '__LISTENER3__';

        farbs.subscribe(topic, listener3);
        farbs.subscribe(topic, listener);
        farbs.subscribe(topic, listener2);

        farbs.unsubscribe(topic, listener);

        expect(farbs.listeners[topic].length).to.equal(2);
        expect(farbs.listeners[topic][0]).to.equal(listener3);
        expect(farbs.listeners[topic][1]).to.equal(listener2);

      });

      bdd.it('should remove duplicate listeners', function(){

        var topic = '__TOPIC__',
            listener = '__LISTENER__';

        farbs.subscribe(topic, listener);
        farbs.subscribe(topic, listener);

        farbs.unsubscribe(topic, listener);

        expect(farbs.listeners[topic].length).to.equal(0);

      });

    });

    bdd.describe('publish()', function(){

      var callCount = 0;
      var listener = function(){
        callCount++;
      };
      var topic = '__TOPIC__';

      bdd.beforeEach(function () {
        farbs.listeners = {};
        callCount = 0;
      });

      bdd.it('should call a listener once for a topic', function(){

        farbs.subscribe(topic, listener);

        farbs.publish(topic);

        expect(callCount).to.equal(1);

      });

      bdd.it('should not call other listeners', function(){
        var listener2 = function(){
          callCount++;
        };
        var topic2 = '__TOPIC2__';

        farbs.subscribe(topic, listener);
        farbs.subscribe(topic2, listener2);

        farbs.publish(topic);

        expect(callCount).to.equal(1);
      });

      bdd.it('should pass data payload to listener', function(){

        var dataPaylodPassed = null;
        var dataPayload = { foo: 'bar' };
        var payloadListener = function(data){
          dataPaylodPassed = data;
        };

        farbs.subscribe(topic, payloadListener);

        farbs.publish(topic, dataPayload);

        expect(dataPayload).to.deep.equal(dataPaylodPassed);
      });

    });

  });


  bdd.describe('parse()', function () {

    // This is an integration test because I don't want to mock the hell outta
    // DOM methods.

    var farbsTestParentNode;

    var Class1 = function (node, farbs) {};

    bdd.before(function () {

      // HTML injection is a hack because I have no clue how Intern intended
      // stuff like this to work w/o selenium.
      farbsTestParentNode = document.createElement('div');
      document.body.appendChild(farbsTestParentNode);

      var xhr = new XMLHttpRequest();
      xhr.open('GET', '../farbs/tests/testparse.html', false);
      xhr.send();
      farbsTestParentNode.innerHTML = xhr.responseText;

    });

    bdd.after(function () {
      document.body.removeChild(farbsTestParentNode);
    });

    bdd.beforeEach(function(){
      farbs.instRegistry = {};
      farbs.classRegistry = {};
    });

    bdd.it('should create instances of available classes', function () {
      farbs.registerClass('Class1', Class1);
      farbs.parse();

      expect(farbs.instRegistry.first).to.be.instanceof(Class1);
      expect(farbs.instRegistry.outerComponent).to.be.instanceof(Class1);
    });

    bdd.it('should not create instances of not available classes', function () {
      farbs.registerClass('Class1', Class1);
      farbs.parse();

      expect(farbs.instRegistry.noSuchClass).to.not.exist;
    });

  });

});
