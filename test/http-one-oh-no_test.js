"use strict"

var http = require("http")
  , assert = require("assert")
  , getPort = require("portfinder").getPort
  , parseUrl = require("url").parse
  , httpOhNo = require("../index.js")

describe("http-one-oh-no", function () {
	var port, server, currentIncomingMessage, currentResponse;

	before(function (done) {
		server = http.createServer(function (req, res) {
			currentIncomingMessage = req
			currentResponse = res
            req.on("data", function () {})
            res.writeHead(200)
            res.end("foo")
		})
		getPort(function (error, foundPort) {
			assert.ifError(error)
			port = foundPort
			server.listen(port, "127.0.0.1", function () {
                return done()
            })
		})
	})

	after(function (done) {
        server.close(function () {
            return done()
        })
	})

    it("make sure our test server is working right", function (done) {
        http.request(parseUrl("http://127.0.0.1:"+port+"/"), function (res) {
            assert.ok(currentIncomingMessage)
            assert.strictEqual(200, res.statusCode)
            assert.strictEqual(currentIncomingMessage.headers["host"], "127.0.0.1:"+port)
            res.on("data", function () {})
            return done()
        }).end()
    })

    it("should send a request without a host header", function (done) {
        httpOhNo.request(parseUrl("http://127.0.0.1:"+port+"/"), function (res) {
            assert.ok(currentIncomingMessage)
            assert.strictEqual(res.statusCode, 200)
            assert.strictEqual(currentIncomingMessage.headers["host"], undefined)
            return done()
        }).end()
    })

    it("should send a request with the correct HTTP version identifier", function (done) {
        httpOhNo.request(parseUrl("http://127.0.0.1:"+port+"/"), function (res) {
            assert.strictEqual(currentIncomingMessage.httpVersion, "1.0")
            return done()
        }).end()
    })
})
