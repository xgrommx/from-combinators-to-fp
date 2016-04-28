import {Y, B, I} from './combinators';
import {head, tail, length, unapply, apply} from './utils';

const reduce = f => Y(g => y => xs => length(xs) < 1 ? y : g(f(y)(head(xs)))(tail(xs)));

const of = (...value) => Array.of(...value) || [...value];

const empty = () => [];

const concat = x => y => x.concat(y);

const flatMap = fn => reduce(acc => next => concat(acc)(fn(next)))(empty());

const fold = reduce(concat)(empty());

const foldMap = fn => reduce(acc => next => concat(acc)(fn(next)))(empty());

const map = fn => flatMap(value => of(fn(value)));

const filter = predicate => flatMap(value => predicate(value) ? of(value) : empty());

const ap = fns => source => flatMap(fn => map(value => fn(value))(source))(fns);

const lift = fn => unapply(reduce(ap)(of(fn)));

const converge = resultSelector => (...fns) => (...args) => apply(resultSelector)(ap(map(fn => apply(fn))(fns))(of(args)));

const juxt = apply(converge(unapply(I)));

const compose = unapply(reduce(B)(I));

export { reduce, of, flatMap, map, filter, ap, lift, converge, juxt, compose, fold, foldMap, concat };