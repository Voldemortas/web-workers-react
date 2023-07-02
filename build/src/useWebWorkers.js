"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var worker_1 = __importDefault(require("./worker"));
var utils_1 = require("./utils");
function useWebWorkers(data, groupCount, fn, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.updateFinished, updateFinished = _c === void 0 ? true : _c, _d = _b.updateState, updateState = _d === void 0 ? true : _d, _e = _b.updateType, updateType = _e === void 0 ? 'every' : _e;
    var groupsArrays = Array.from({ length: groupCount }).map(function (_, i) { return i; });
    var groupSizes = (0, utils_1.getGroupSizes)(data.length, groupCount).reduce(function (a, b, i) { return __spreadArray(__spreadArray([], a, true), [a[i] + b], false); }, [0]);
    var slicedArrays = groupsArrays.map(function (id) {
        return data.slice(groupSizes[id], groupSizes[id + 1]);
    });
    var _f = (0, react_1.useState)([]), state = _f[0], setState = _f[1];
    var _g = (0, react_1.useState)(groupSizes
        .slice(1)
        .map(function (val, id) { return ({ finished: 0, total: val - groupSizes[id] }); })), finished = _g[0], setFinished = _g[1];
    var workers = [];
    (0, react_1.useEffect)(function () {
        if (window.Worker) {
            workers = groupsArrays.map(function (id) {
                return (0, utils_1.makeWorker)(worker_1.default, id.toString(), slicedArrays[id], fn, function (response) {
                    if (updateState) {
                        setState(function (prev) { return __spreadArray(__spreadArray([], prev, true), [response], false); });
                    }
                    if (updateFinished) {
                        setFinished(function (prev) {
                            var newFinished = __spreadArray([], prev, true);
                            newFinished[id] = __assign(__assign({}, newFinished[id]), { finished: updateType === 'every'
                                    ? newFinished[id].finished + 1
                                    : newFinished[id].total });
                            return newFinished;
                        });
                    }
                }, updateType);
            });
        }
        return function () {
            workers.forEach(function (w) { return w.terminate(); });
        };
    }, [groupCount]);
    return { result: state.flat(), finished: finished };
}
exports.default = useWebWorkers;
