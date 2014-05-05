"use strict"

var inherits = require("util").inherits
  , net = require("net")

var ClientRequest = module.exports = function () {
    net.Socket.call(this)
    this._headWritten = false
    this._endRequested = false
    this._endData = undefined
}
inherits(ClientRequest, net.Socket)

ClientRequest.prototype.doneWritingHead = function () {
    this._headWritten = true
}

ClientRequest.prototype.end = function (data) {
    if (this._headWritten) {
        net.Socket.prototype.end.call(this, this._endData)
        this._endData = null
    }
    else {
        this._endRequested = true
        if (data) {
            this._endData = data
        }
    }
}
