"use strict"

var connect = require("net").connect
  , parseUrl = require("url").parse
  , ClientRequest = require("./src/ClientRequest.js")

var request = module.exports.request = function (options, responseHandler) {
    if (typeof options === "string") {
        options = parseUrl(options)
    }

    var host = options.hostname || options.host || "localhost"
    var port = options.port || 80
    var method = options.method || "GET"
    var path = options.path || "/"
    var headers = options.headers || {}

    var sock = new ClientRequest()
    sock.connect(port, host, function () {
        sock.write(method + " " + path + " HTTP/1.0\r\n")
        Object.keys(headers).forEach(function (name) {
            sock.write(name + ": " + headers[name] + "\r\n")
        })
        sock.write("\r\n")
        sock.doneWritingHead()
    })

    var head = ""
    var headReader = function (data) {
        head += data
        if (head.match(/\r\n\r\n/)) {
            sock.removeListener("data", headReader)
            _headParser(head, sock)
            sock.emit("response", sock)
            var bodySoFar = head.match(/\r\n\r\n(.+)/)
            if (bodySoFar) {
                sock.emit("data", new Buffer(bodySoFar[1]))
            }
        }
    }
    sock.on("data", headReader)

    if (responseHandler) {
        sock.on("response", responseHandler)
    }

    return sock
}

var get = module.exports.get = function (options, responseHandler) {
    var req = request(options, responseHandler)
    req.end()
    return req
}

var _headParser = function (head, response) {
    var lines = head.split(/\r\n/)

    var statusLine = lines.shift()
    var statusParts = statusLine.match(/^HTTP\/1\.\d+ (\d+) ?(.*)/)
    if (statusParts) {
        response.statusCode = parseInt(statusParts[1])
    }

    response.headers = {}
    lines.forEach(function (line) {
        var parts = line.match(/([^:]+): (.*)/)
        if (parts) {
            response.headers[parts[1].toLowerCase()] = parts[2]
        }
    })

    return response
}
