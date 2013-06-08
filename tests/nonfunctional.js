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
        farbs.listerns = {};
      });

      bdd.it('should create an array in the listeners object for the give topic', function(){

        var topic = '__TOPIC__',
            listener = '__LISTENER__';

        farbs.subscribe(topic, listener);

        expect(opts.call(farbs.listeners[topic])).to.equal('[object Array]');

      });

    });

  });

});
