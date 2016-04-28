(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// I :: a -> a
var I = function I(x) {
  return x;
};

// K :: a -> b -> a
var K = function K(x) {
  return function (y) {
    return x;
  };
};

// C :: (a -> b -> c) -> b -> a -> c
var C = function C(x) {
  return function (y) {
    return function (z) {
      return x(z)(y);
    };
  };
};

// S :: (a -> b -> c) -> (a -> b) -> a -> c
var S = function S(x) {
  return function (y) {
    return function () {
      return x.apply(undefined, arguments)(y.apply(undefined, arguments));
    };
  };
};

// B :: (b -> c) -> (a -> b) -> a -> c
var B = S(K(S))(K);

// M :: a -> a -> a
var M = function M(x) {
  return x(x);
};

var Y = function Y(f) {
  return M(function (x) {
    return function (y) {
      return f(x(x))(y);
    };
  });
};

// A :: (a -> a) -> a -> a
var A = C(B(B)(I))(I);

// T :: a -> (a -> a) -> a
var T = C(A);

exports.I = I;
exports.K = K;
exports.C = C;
exports.S = S;
exports.B = B;
exports.M = M;
exports.Y = Y;
exports.A = A;
exports.T = T;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

var disposable = function disposable() {
    for (var _len = arguments.length, disposables = Array(_len), _key = 0; _key < _len; _key++) {
        disposables[_key] = arguments[_key];
    }

    return function () {
        return disposables.forEach(function (dispose) {
            return dispose();
        });
    };
};

var basicObserver = {
    next: function next(v) {},
    error: function error(e) {},
    completed: function completed() {},
    disposed: false
};

// of :: a -> Observable a
var of = function of(value) {
    return function () {
        var _ref = arguments.length <= 0 || arguments[0] === undefined ? basicObserver : arguments[0];

        var next = _ref.next;
        var error = _ref.error;
        var completed = _ref.completed;
        var disposed = _ref.disposed;
        return next(value), function () {
            return console.log('of disposed!');
        };
    };
};

// fromEvent :: String -> DomElement -> Observable Event
var fromEvent = function fromEvent(name) {
    return function (element) {
        return function () {
            var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? basicObserver : arguments[0];

            var next = _ref2.next;
            var error = _ref2.error;
            var completed = _ref2.completed;
            var disposed = _ref2.disposed;

            element.addEventListener(name, function (e) {
                return disposed !== true && next(e);
            });

            return function () {
                disposed = true;
                console.log('fromEvent disposed!');
                element.removeEventListener(name, function (e) {
                    return next(e);
                });
            };
        };
    };
};

// interval :: Number -> Observable Number
var interval = function interval(time) {
    return function () {
        var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? basicObserver : arguments[0];

        var next = _ref3.next;
        var error = _ref3.error;
        var completed = _ref3.completed;
        var disposed = _ref3.disposed;

        var i = 0;
        var id = setInterval(function () {
            disposed !== true && next(++i);
        }, time);

        return function () {
            disposed = true;
            console.log('interval disposed!');
            clearInterval(id);
        };
    };
};

// map :: (a -> b) -> Observable a -> Observable b
var map = function map(fn) {
    return function (source) {
        return function () {
            var _ref4 = arguments.length <= 0 || arguments[0] === undefined ? basicObserver : arguments[0];

            var _next = _ref4.next;
            var error = _ref4.error;
            var completed = _ref4.completed;
            var disposed = _ref4.disposed;
            return source({ next: function next(v) {
                    return _next(fn(v));
                } });
        };
    };
};

// filter :: (a -> bool) -> Observable a -> Observable a
var filter = function filter(predicate) {
    return function (source) {
        return function (o) {
            return source({ next: function next(v) {
                    return predicate(v) && o.next(v);
                } });
        };
    };
};

// scan :: (b -> a -> b) -> b -> Observable a -> Observable b
var scan = function scan(acc) {
    return function (seed) {
        var accumulation = arguments.length <= 1 || arguments[1] === undefined ? seed : arguments[1];
        return function (source) {
            return function () {
                var _ref5 = arguments.length <= 0 || arguments[0] === undefined ? basicObserver : arguments[0];

                var _next2 = _ref5.next;
                var error = _ref5.error;
                var completed = _ref5.completed;
                var disposed = _ref5.disposed;

                return source({ next: function next(v) {
                        return _next2((accumulation = acc(accumulation, v), accumulation));
                    } });
            };
        };
    };
};

// mergeArray :: [Observable a] -> Observable a
var mergeArray = function mergeArray(streams) {
    return function () {
        var _ref6 = arguments.length <= 0 || arguments[0] === undefined ? basicObserver : arguments[0];

        var _next3 = _ref6.next;
        var error = _ref6.error;
        var completed = _ref6.completed;
        var disposed = _ref6.disposed;

        return disposable.apply(undefined, _toConsumableArray(streams.map(function (stream) {
            return stream({ next: function next(v) {
                    return _next3(v);
                } });
        })));
    };
};

exports.basicObserver = basicObserver;
exports.disposable = disposable;
exports.of = of;
exports.interval = interval;
exports.fromEvent = fromEvent;
exports.map = map;
exports.filter = filter;
exports.scan = scan;
exports.mergeArray = mergeArray;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.concat = exports.foldMap = exports.fold = exports.compose = exports.juxt = exports.converge = exports.lift = exports.ap = exports.filter = exports.map = exports.flatMap = exports.of = exports.reduce = undefined;

var _combinators = require('./combinators');

var _utils = require('./utils');

var reduce = function reduce(f) {
  return (0, _combinators.Y)(function (g) {
    return function (y) {
      return function (xs) {
        return (0, _utils.length)(xs) < 1 ? y : g(f(y)((0, _utils.head)(xs)))((0, _utils.tail)(xs));
      };
    };
  });
};

var of = function of() {
  for (var _len = arguments.length, value = Array(_len), _key = 0; _key < _len; _key++) {
    value[_key] = arguments[_key];
  }

  return Array.of.apply(Array, value) || [].concat(value);
};

var empty = function empty() {
  return [];
};

var concat = function concat(x) {
  return function (y) {
    return x.concat(y);
  };
};

var flatMap = function flatMap(fn) {
  return reduce(function (acc) {
    return function (next) {
      return concat(acc)(fn(next));
    };
  })(empty());
};

var fold = reduce(concat)(empty());

var foldMap = function foldMap(fn) {
  return reduce(function (acc) {
    return function (next) {
      return concat(acc)(fn(next));
    };
  })(empty());
};

var map = function map(fn) {
  return flatMap(function (value) {
    return of(fn(value));
  });
};

var filter = function filter(predicate) {
  return flatMap(function (value) {
    return predicate(value) ? of(value) : empty();
  });
};

var ap = function ap(fns) {
  return function (source) {
    return flatMap(function (fn) {
      return map(function (value) {
        return fn(value);
      })(source);
    })(fns);
  };
};

var lift = function lift(fn) {
  return (0, _utils.unapply)(reduce(ap)(of(fn)));
};

var converge = function converge(resultSelector) {
  return function () {
    for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      fns[_key2] = arguments[_key2];
    }

    return function () {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return (0, _utils.apply)(resultSelector)(ap(map(function (fn) {
        return (0, _utils.apply)(fn);
      })(fns))(of(args)));
    };
  };
};

var juxt = (0, _utils.apply)(converge((0, _utils.unapply)(_combinators.I)));

var compose = (0, _utils.unapply)(reduce(_combinators.B)(_combinators.I));

exports.reduce = reduce;
exports.of = of;
exports.flatMap = flatMap;
exports.map = map;
exports.filter = filter;
exports.ap = ap;
exports.lift = lift;
exports.converge = converge;
exports.juxt = juxt;
exports.compose = compose;
exports.fold = fold;
exports.foldMap = foldMap;
exports.concat = concat;

},{"./combinators":1,"./utils":4}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
            arr2[i] = arr[i];
        }return arr2;
    } else {
        return Array.from(arr);
    }
}

function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
}

var head = function head(_ref) {
    var _ref2 = _toArray(_ref);

    var _head = _ref2[0];

    var tail = _ref2.slice(1);

    return _head;
};
var tail = function tail(_ref3) {
    var _ref4 = _toArray(_ref3);

    var head = _ref4[0];

    var _tail = _ref4.slice(1);

    return _tail;
};
var length = function length(_ref5) {
    var _length = _ref5.length;
    return _length;
};

var _curry = function _curry(fn) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
    }

    return function () {
        for (var _len2 = arguments.length, innerArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            innerArgs[_key2] = arguments[_key2];
        }

        return fn.apply(undefined, args.concat(innerArgs));
    };
};

var curry = function curry(fn) {
    var n = arguments.length <= 1 || arguments[1] === undefined ? fn.length : arguments[1];

    return function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
        }

        if (args.length < n) {
            return n - args.length > 0 ? curry(_curry.apply(undefined, [fn].concat(args)), n - args.length) : _curry.apply(undefined, [fn].concat(args));
        } else {
            return fn.apply(undefined, args);
        }
    };
};

var apply = function apply(fn) {
    return function (args) {
        return fn.apply(undefined, _toConsumableArray(args));
    };
};
var unapply = function unapply(fn) {
    return function () {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
        }

        return fn(args);
    };
};

exports.head = head;
exports.tail = tail;
exports.length = length;
exports.curry = curry;
exports.apply = apply;
exports.unapply = unapply;

},{}],5:[function(require,module,exports){
'use strict';

var _reactive = require('../build/frp/reactive');

var _build = require('../build');

var minus$ = (0, _reactive.map)(function (x) {
    return -1;
})((0, _reactive.fromEvent)('click')(document.getElementById('minus')));
var plus$ = (0, _reactive.map)(function (x) {
    return 1;
})((0, _reactive.fromEvent)('click')(document.getElementById('plus')));

var dispose = (0, _build.compose)((0, _reactive.scan)(function (acc, next) {
    return Math.min(10, Math.max(-10, acc + next));
})(0), _reactive.mergeArray)([plus$, minus$, (0, _reactive.of)(0), (0, _reactive.map)(function (x) {
    return 1;
})((0, _reactive.interval)(2000))])({ next: function next(v) {
        document.getElementById('display').innerHTML = v;
    } });

},{"../build":3,"../build/frp/reactive":2}]},{},[5]);
