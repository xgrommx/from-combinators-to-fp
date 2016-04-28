import {of, map, filter, flatMap, ap, lift, converge, juxt, reduce, compose, concat, fold, foldMap} from ".";

// wrapper
console.log(of(42), 'of');
// concat
console.log(concat([1,2,3])([4]), 'concat');
// map
console.log(map(x => x * 10)([1, 2, 3]), 'map');
// filter
console.log(filter(x => x % 2 === 0)([1, 2, 3]), 'filter');
// flatMap
console.log(flatMap(x => [x * 2, x * 3, x * 4])([1, 2, 3]), 'flatMap');
// applicative
console.log(ap([x => x + 42, x => x * 42])([1,2,3]), 'applicative');
// lift
console.log(lift(x => y => z => x + y + z)([1, 2, 3], [4, 5, 6], [7]), 'lift');
// converge
console.log(converge((x, y) => x * y)((x, y) => x + y, (x, y) => x - y)(3, 4), 'converge');
// juxt
console.log(juxt([Math.max, Math.min])(1, 2, 3, 4, 5), 'juxt');
// reduce
console.log(reduce(acc => next => acc + next)(0)([1,2,3,4,5]), 'reduce');
// compose
console.log(compose(x => x * 10, x => x + 2, (x, y) => x + y)(10, 20), 'compose');
// fold
console.log(fold([[1], [2], [3], [4]]), 'fold');
// foldMap
console.log(foldMap(x => x * 10)([[1], [2], [3], [4]]), 'foldMap');

// Laws
console.log(map(x => x * 10)([1,2,3]), ap(of(x => x * 10))([1,2,3]));