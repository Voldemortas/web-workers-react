"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeWorker = exports.getGroupSizes = void 0;
function getGroupSizes(dataSize, groupCount) {
    function reducer(obj, currentIndex) {
        var size = Math.round(obj.remainder / (groupCount - currentIndex));
        return { groups: __spreadArray(__spreadArray([], obj.groups, true), [size], false), remainder: obj.remainder - size };
    }
    return Array.from({ length: groupCount })
        .map(function (_, i) { return i; })
        .reduce(reducer, { groups: [], remainder: dataSize }).groups;
}
exports.getGroupSizes = getGroupSizes;
function makeWorker(workerFunc, name, data, callback, onResponse, updateType) {
    var code = workerFunc.toString();
    var blob = new Blob(["(".concat(code, ")()")]);
    var createdWorker = new Worker(URL.createObjectURL(blob), { name: name });
    createdWorker.postMessage({ data: data, callback: callback.toString(), updateType: updateType });
    createdWorker.addEventListener('message', function (r) {
        return onResponse(updateType === 'every' ? r.data : r.data.flat());
    });
    return createdWorker;
}
exports.makeWorker = makeWorker;
