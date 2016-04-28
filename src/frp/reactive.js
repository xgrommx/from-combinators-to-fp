const disposable = (...disposables) => () => disposables.forEach(dispose => dispose());

const basicObserver = {
    next: v => {},
    error: e => {},
    completed: () => {},
    disposed: false
};

// of :: a -> Observable a
const of = value => ({next, error, completed, disposed} = basicObserver) => (next(value), () => console.log('of disposed!'));

// fromEvent :: String -> DomElement -> Observable Event
const fromEvent = name => element => ({next, error, completed, disposed} = basicObserver) => {
    element.addEventListener(name, (e) => disposed !== true && next(e));

    return () => {
        disposed = true;
        console.log('fromEvent disposed!');
        element.removeEventListener(name, (e) => next(e));
    };
};

// interval :: Number -> Observable Number
const interval = (time) => ({next, error, completed, disposed} = basicObserver) => {
    let i = 0;
    let id = setInterval(() => {
        disposed !== true && next(++i);
    }, time);

    return () => {
        disposed = true;
        console.log('interval disposed!');
        clearInterval(id);
    };
};

// map :: (a -> b) -> Observable a -> Observable b
const map = fn => source => ({next, error, completed, disposed} = basicObserver) => source({next: v => next(fn(v))});

// filter :: (a -> bool) -> Observable a -> Observable a
const filter = predicate => source => o => source({next: v => predicate(v) && o.next(v)});

// scan :: (b -> a -> b) -> b -> Observable a -> Observable b
const scan = acc => (seed, accumulation = seed) => source => ({next, error, completed, disposed} = basicObserver) => {
    return source({next: v => next((accumulation = acc(accumulation, v), accumulation))});
};

// mergeArray :: [Observable a] -> Observable a
const mergeArray = streams => ({next, error, completed, disposed} = basicObserver) => {
    return disposable(...streams.map(stream => {
        return stream({next: v => next(v)});
    }));
};

export { basicObserver, disposable, of, interval, fromEvent, map, filter, scan, mergeArray };