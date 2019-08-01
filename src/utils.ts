/**
 * Curries a function with two arguments and flip them
 * @param fn
 */
export const curryTwoFlip = <A, B, R>(fn: (a: A, b: B) => R): ((b: B) => (a: A) => R) =>
  (b: B): (a: A) => R =>
    (a: A): R => fn(a, b)

/**
 * Performs left-to-right function composition
 * @param fn1
 * @param fns
 */
export const pipe = <A extends any[], R>(fn1: (...args: A) => R, ...fns: Array<(a: R) => R>): ((...args: A) => R) => {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: R): R => nextFn(prevFn(value)),
    value => value
  )
  return (...args: A): R => piped(fn1(...args))
}

/**
 * Converts a hexadecimal string to an array of 8-bit unsigned integer values
 * @param hexString
 */
export const parseHexStringToBuffer = (hexString: string): number[] => {
  const list: string[] | null = hexString.match(/.{1,2}/g)

  return list ? list.map(s => Number(`0x${s}`)) : []
}
