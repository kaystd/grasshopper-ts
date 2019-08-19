import { decrypt, encrypt } from './grasshopper'

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
export const pipe = <A extends any[], R extends any>(fn1: (...args: A) => R, ...fns: Array<(a: R) => R>): ((...args: A) => R) => {
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

/**
 * Converts Utf-8 string to array of 8-bit unsigned integer values
 * @param utf8String
 */
export const utf8ToBuffer = (utf8String: string): number[] => {
  const textEncoder = new TextEncoder()
  const buffer = textEncoder.encode(utf8String)

  return Array.from(buffer)
}

/**
 * Complements message to block's length
 * @param buffer
 */
export const complementMessage = (buffer: number[]): number[] => {
  const mapping = (_: number, ind: number): number => ind === 0 ? 128 : 0
  const lengthModulo = buffer.length % 16
  return lengthModulo === 0
    ? buffer.concat(Array(16).fill(0).map(mapping))
    : buffer.concat(Array(16 - lengthModulo).fill(0).map(mapping))
}

/**
 * Truncates padded bits
 * @param buffer
 */
export const truncateMessage = (buffer: number[]): number[] => {
  const index = buffer.lastIndexOf(128)

  return buffer.slice(0, index)
}

/**
 * Converts Utf-8 string to Base-64 string
 * @param utf8String
 */
export const utf8ToBase64 = (utf8String: string): string => Buffer.from(utf8String).toString('base64')

/**
 * Converts Base-64 string to Utf-8 string
 * @param base64String
 */
export const base64ToUtf8 = (base64String: string): string => Buffer.from(base64String, 'base64').toString()

/**
 * Converts array of 8-bit unsigned integer values to Base-64 string
 * @param buffer
 */
export const bufferToBase64 = (buffer: number[]): string => Buffer.from(buffer).toString('base64')

/**
 * Converts Base-64 string to array of 8-bit unsigned integer values
 * @param base64String
 */
export const base64ToBuffer = (base64String: string): number[] => Array.from(Buffer.from(base64String, 'base64'))

/**
 * Split message to 128-bit chunks
 * @param buffer
 */
export const splitMessage = (buffer: number[]): number[][] => {
  const chunksNumber = Math.floor(buffer.length / 16)

  return Array(chunksNumber).fill(0).map((val, ind) => buffer.slice(ind * 16, (ind + 1) * 16))
}

/**
 * Joins 128-bit chunks into message
 * @param buffers
 */
export const joinMessage = (buffers: number[][]): number[] => buffers.flat()

/**
 * Encrypts Utf-8 string message and returns encrypted message in Base-64
 * @param message Utf-8 string
 * @param masterKey Base-64 string
 *
 */
export const encryptString = (message: string, masterKey: string): string => {
  const masterKeyBuffer = base64ToBuffer(masterKey)
  const curriedEncrypt = curryTwoFlip(encrypt)(masterKeyBuffer)

  const complemented = pipe(utf8ToBuffer, complementMessage)(message)
  const split = splitMessage(complemented)
  const encrypted = split.map(curriedEncrypt)
  const joined = joinMessage(encrypted)

  return bufferToBase64(joined)
}
