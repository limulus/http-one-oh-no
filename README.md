http-one-oh-no [![Build Status](https://travis-ci.org/limulus/http-one-oh-no.svg)](https://travis-ci.org/limulus/http-one-oh-no)
==============

Make HTTP 1.0 requests

Synopsis
--------

Do you want to make an HTTP request using Node? Then this package is **not** what you are looking for. 99.9% of the time you want to be making HTTP 1.1 requests, not HTTP 1.0 requests like this package makes. The built in [http](http://nodejs.org/api/http.html) module or the [request](https://www.npmjs.org/package/request) npm package is what you actually want.


But Then Why HTTP 1.0!?
-----------------------

Because your server will get HTTP 1.0 requests without a `Host` header, and you should test that. Maybe there are other reasons.


Caveats
-------

No support for HTTPS. Only aiming to be close to `http.request()` and `http.get()`. This was all done hastily on a Sunday.


Installation
------------

```shell
npm install http-one-oh-no
```


Usage
-----

Usage is the same as the [http.request](http://nodejs.org/api/http.html#http_http_request_options_callback) and [http.get](http://nodejs.org/api/http.html#http_http_get_options_callback) functions.
