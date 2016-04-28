// When we need to provide a variable for a function
(x => console.log(x * 10, 'provide a variable for a function'))(10);
// When we need provide a function for a variable on demand
(f => { f(10); f(20); f(30) })(x => console.log(x * 10, 'provide a function for a variable'));