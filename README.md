http-one-oh-no
==============

Make HTTP 1.0 requests

Synopsis
--------

Do you want to make an HTTP request using Node? Then this package is likely **not** what you are looking for. 99.9% of the time you want to be making HTTP 1.1 requests, not HTTP 1.0 requests like this one makes. The built in [http](http://nodejs.org/api/http.html) module or the [request](https://www.npmjs.org/package/request) npm package is what you actually want.


Why Oh Why HTTP 1.0!?
---------------------

Because your server will get HTTP 1.0 requests without a `Host` header, and you should test that. Maybe there are other reasons too.


Installation
------------

```shell
npm install http-one-oh-no
```

