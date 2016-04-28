const observable = value => o => {
    o.next(value);
    o.completed();
};

observable(10)({
    next: v => console.log(v, 'next'),
    error: e => console.log(e, 'error'),
    completed: () => console.log('completed')
});