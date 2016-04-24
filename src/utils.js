const head = ([head, ...tail]) => head;
const tail = ([head, ...tail]) => tail;
const length = ({length}) => length;

const _curry = (fn, ...args) => (...innerArgs) => fn(...args, ...innerArgs);

const curry = (fn, n = fn.length) => {
    return (...args) => {
        if (args.length < n) {
            return n - args.length > 0 ?
                curry(_curry(fn, ...args),
                    n - args.length) :
                _curry(fn, ...args);
        }
        else {
            return fn(...args);
        }
    };
};

const apply = fn => args => fn(...args);
const unapply = fn => (...args) => fn(args);

export {
    head,
    tail,
    length,
    curry,
    apply,
    unapply
};