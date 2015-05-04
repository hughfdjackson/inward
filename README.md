# Inward

Growing node-based apps can be difficult.  Even if your service is just medium sized, weird bugs and hard-to-think-about concurrency can be all too common. 

`Inward` is about leveraging new node.js tech to make your life easier, even as your app grows.

### What Tech?

`Inward` uses two main ideas - that immutable data (provided by facebook's [immutable-js](https://github.com/facebook/immutable-js)) makes hard-to-find bugs hard-to-write, and promises make node.js' asynchronous IO less painful for you to use.
 
### So this is new, cutting edge, risky stuff?

Promises have become so popular, they've [been penciled in as an official part of the next JavaScript spec](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).  [Immutable.js](https://www.npmjs.com/package/immutable) has facebook's stamp of approval, hundreds of thousands of monthly downloads, and is based on the [same techniques that form the core of clojure's datastructures]().  

Using promises and immutable data together in a http server is *also* nothing new - we're just borrowing a leaf out of the playbook of [major frameworks from other languages](https://www.playframework.com/) - frameworks I've used in anger with plenty of success.

Now is the right time.


## Hello World

```javascript
var Inward = require('inward');
var Response = Inward.Response;
var Route = Inward.Route;

var helloWorldHandler = function(request){
    var params = request.get('params');
    return Response.OK('hi, ' + params.get('name'));
};

var route404 = function(){
    return Response.NotFound("ain't nothing to see here");
};

var server = Inward.Server({
    routes: [
        Route.Get('/hello/:name', helloWorldHandler),
        Route.Any('*', route404)
    ]
});

Inward.runHttp(server, 3000);
```

## Quick-Start Guide

To get up and running quickly, see [the Quick-Start Guide](https://github.com/hughfdjackson/inward/wiki/QuickStart-Guide);

## API Documentation

For in-depth info for every function, see the [API Documentation](https://github.com/hughfdjackson/inward/wiki/API-Documentation).
