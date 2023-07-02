"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function worker() {
    self.onmessage = function (_a) {
        var data = _a.data;
        var actualCallback = new Function('return ' + data.callback)();
        if (data.updateType === 'every') {
            data.data.forEach(function (item) {
                self.postMessage(actualCallback(item));
            });
        }
        if (data.updateType === 'batch') {
            self.postMessage(data.data.map(actualCallback));
        }
    };
}
exports.default = worker;
