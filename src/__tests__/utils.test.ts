import { curryTwoFlip, parseHexStringToBuffer, pipe } from '../utils'

describe('Utils functions', () => {

  describe('parseHexStringToBuffer', () => {
    it('empty vector', () => {
      const vector = ''
      const buffer: number[] = []
      expect(parseHexStringToBuffer(vector)).toEqual(buffer)
    })
    it('4-bit vector', () => {
      const vector = 'f'
      const buffer = [15]
      expect(parseHexStringToBuffer(vector)).toEqual(buffer)
    })
    it('8-bit vector', () => {
      const vector = 'fe'
      const buffer = [254]
      expect(parseHexStringToBuffer(vector)).toEqual(buffer)
    })
    it('128-bit vector', () => {
      const vector = 'ffeeddccbbaa99881122334455667700'
      const buffer = [255, 238, 221, 204, 187, 170, 153, 136, 17, 34, 51, 68, 85, 102, 119, 0]
      expect(parseHexStringToBuffer(vector)).toEqual(buffer)
    })
  })

  describe('curryTwoFlip', () => {
    it('partial application', () => {
      const sum = (a: string, b: string): string => a + b
      const partial = curryTwoFlip(sum)('function')
      expect(partial('Curried ')).toEqual('Curried function')
    })
    it('two arguments', () => {
      const sum = (a: string, b: string): string => a + b
      const curried = curryTwoFlip(sum)('function')('Curried ')
      expect(curried).toEqual('Curried function')
    })
  })

  describe('pipe', () => {
    it('composition of two functions', () => {
      const add4 = (a: number): number => a + 4
      const mul3 = (a: number): number => a * 3
      const piped = pipe(add4, mul3)(1)
      expect(piped).toEqual(15)
    })
    it('composition of four functions', () => {
      const add4 = (a: number): number => a + 4
      const mul3 = (a: number): number => a * 3
      const piped = pipe(add4, mul3, add4, mul3)(1)
      expect(piped).toEqual(57)
    })
    it('composition of two functions with two args', () => {
      const add = (a: number, b: number): number => a + b
      const mul = (a: number): (b: number) => number => (b: number): number => a * b
      const piped = pipe(add, mul(3))(2, 3)
      expect(piped).toEqual(15)
    })
  })
})
