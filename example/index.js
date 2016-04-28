import {fromEvent, map, scan, mergeArray, interval, of} from '../build/frp/reactive';
import {compose} from '../build';

const minus$ = map(x => -1)(fromEvent('click')(document.getElementById('minus')));
const plus$ = map(x => 1)(fromEvent('click')(document.getElementById('plus')));

const dispose = compose(
    scan((acc, next) => Math.min(10, Math.max(-10, acc + next)))(0),
    mergeArray
)([plus$, minus$, of(0), map(x => 1)(interval(2000))])({next: v => {
    document.getElementById('display').innerHTML = v;
}});