#About

farbs is a **F**ramework **A**gnostic **R**egistry **B**ased **S**keleton for decoupled UI widgets or components.

It allows you to declaratively setup your UI components and configure them from within HTML without any JavaScript.

#Why

The benefit farbs offers is a clean separation between generic UI components and application logic, independent of any framework.

And it's only 948 bytes in size (457 bytes gzip'ed).

#How it works

farbs is a singleton object that holds registries for classes, instances and methods and offers a pub/sub mechanism.

Classes are registered with farbs like this:

```javascript
farbs.registerClass('FancyCheckbox', TheFancyCheckboxClass);
```

To instantiate an instance of the class, add a `data-farbs_type` attribute to an HTML element:

```html
<checkbox id="myFancyCheckbox" data-farbs_type="FancyCheckbox">
```

The farbs object has a `parse()` method, that will look for the `data-farbs_type` attribute and create instances of found types:

```javascript
farbs.parse();
```

farbs will register the created instances by their id in it's instance registry:

```javascript
var myFancyCheckboxInst = farbs.instRegistry.myFancyCheckbox;
```

See the [basic example](http://jensarps.github.io/farbs/example/basic/) ([source](https://github.com/jensarps/farbs/tree/master/example/basic)) for an example of how it works.

#What else?

farbs mixes all attributes that start with `data-farbs_` into the created instance. This way you can inject configuration options into your component.

```html
<div id="myComponent" data-farbs_type="SomeComponent" data-farbs_color="green">
```

leads to:

```javascript
farbs.instRegistry.myComponent.color; // 'green'
```

farbs has a method registry that can be used to access methods that are declared elsewhere (typically, you have a generic component and specific methods). An example:

```javascript
farbs.registerMethod('notifyUser', function(value){ alert('foo: ' + value); });
```

You can pass the method's registry id to an instance using data attributes:

```html
<checkbox 
  id="myFancyCheckbox" 
  data-farbs_type="FancyCheckbox"
  data-farbs_onchange="notifyUser"
>
```

and then obtain a reference to it in your component through the method registry:

```javascript
var changeHandler = farbs.method.Registry[this.onchange];
if (changeHandler) {
	// we have have a handler, let's call it
	changeHandler(this.domNode.checked);
}
```

See the [basic example](http://jensarps.github.io/farbs/example/basic/) ([source](https://github.com/jensarps/farbs/tree/master/example/basic)) for an example of usage of the method registry.

#More decoupling

If you want to go the whole way, farbs also comes with a pub/sub mechanism.

A topic is published like this:

```javascript
farbs.publish('/Checkbox/change', ['checkbox', this.domNode.checked]);
```

`publish()` takes two arguments: first, the topic to be published, and second, the data payload (optional).

Subscribing to a topic works like this:

```javascript
farbs.subscribe('/Checkbox/change', this.changeSubscriber);
```

The first argument is the topic to subscribe two, the second is the function to call when that topic is published. The callback function will recieve the data payload as only argument.

To unsubscribe, just call farbs' `unsubscribe()` method and pass the topic and function to unsubscribe:

```javascript
farbs.unsubscribe('/Checkbox/change', this.changeSubscriber);
```

See the [pubsub example](http://jensarps.github.io/farbs/example/pubsub/) ([source](https://github.com/jensarps/farbs/tree/master/example/pubsub)) for an example of how it works.

#Accessing the farbs object

farbs comes as an AMD module. To access it, you need to `require()` it. 

The only exception from this are instances created by farbs: They get two arguments passed to their constructor: first, the DOM node of the element that had the `data-farbs_type` attribute, and second, the farbs object itself, which you can, e.g., store on the instance:

```javascript
function FancyCheckbox (domNode, farbs) {
  this.domNode = domNode;
  this.farbs = farbs;
}
```

As you probably create your UI components as modules, you could also leverage function scope to hold the reference to farbs:

```javascript
var farbs;

function FancyCheckbox (domNode, _farbs) {
  this.domNode = domNode;
  farbs = _farbs;
}
```

#Frameworks

If you want to use, e.g., jQuery for your UI components or Underscore for tooling, that's perfectly fine - farbs does not stand in your way. Check the [jquery example](http://jensarps.github.io/farbs/example/jquery/) ([source](https://github.com/jensarps/farbs/tree/master/example/jquery)) to see how to startup a jQuery UI widget via farbs.

#Docs

API docs are minimal, but existing: http://jensarps.github.io/farbs/jsdoc/farbs.html

#Tests

Tests are in the `tests` directory and are using [the intern](https://github.com/theintern/intern). To run them, clone the intern repository as a sibling to farbs, start a local webserver and point your browser to `http://localhost/path/to/intern/client.html?config=farbs/tests/intern`. Test results appear in the console.

#License

MIT

#Questions?

Don't hesitate to ping me on [Twitter](https://twitter.com/jensarps) or [Google+](https://plus.google.com/u/0/118110542957297456336/)
