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
            res.end()
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

    it("should make an HTTP 1.0 request", function (done) {
        httpOhNo.request(parseUrl("http://127.0.0.1:"+port+"/"), function (res) {
            assert.ok(currentIncomingMessage)
            assert.strictEqual(currentIncomingMessage.headers["host"], undefined)
            res.on("data", function () {})
            return done()
        }).end()
    })
})
