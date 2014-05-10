"use strict"

var connect = require("net").connect
  , parseUrl = require("url").parse
  , StreamSearch = require("streamsearch")
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
        endOfHeadSearch.push(data)
    }
    sock.on("data", headReader)

    var httpHeadDelimiter = "\r\n\r\n"
      , endOfHeadSearch = new StreamSearch(httpHeadDelimiter)
    endOfHeadSearch.on("info", function (isMatch, data, start, end) {
        if (data) {
            head += data.toString("ascii", start, end)
        }
        if (isMatch) {
            // Our caller now gets to continue to listen for data events
            endOfHeadSearch.removeAllListeners("info")
            sock.removeListener("data", headReader)

            // We've got a response
            _headParser(head, sock)
            sock.emit("response", sock)

            // Emit any left over data
            if (data && data.length > end + httpHeadDelimiter.length) {
                sock.emit("data", data.slice(end + httpHeadDelimiter.length))
            }
        }
    })

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
