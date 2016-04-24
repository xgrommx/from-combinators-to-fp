// I :: a -> a
const I = x => x;

// K :: a -> b -> a
const K = x => y => x;

// C :: (a -> b -> c) -> b -> a -> c
const C = x => y => z => x(z)(y);

// S :: (a -> b -> c) -> (a -> b) -> a -> c
const S = x => y => (...z) => x(...z)(y(...z));

// B :: (b -> c) -> (a -> b) -> a -> c
const B = S(K(S))(K);

// M :: a -> a -> a
const M = x => x(x);

const Y = f => M(x => y => f(x(x))(y));

// A :: (a -> a) -> a -> a
const A = C((B(B))(I))(I);

// T :: a -> (a -> a) -> a
const T = C(A);

export {I, K, C, S, B, M, Y, A, T};