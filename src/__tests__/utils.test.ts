import {
  base64ToBuffer,
  base64ToUtf8,
  bufferToBase64,
  complementMessage,
  curryTwoFlip,
  decryptString,
  encryptString,
  generateKey,
  joinMessage,
  parseHexStringToBuffer,
  pipe,
  splitMessage,
  truncateMessage,
  utf8ToBase64,
  utf8ToBuffer,
} from '../utils'

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

  describe('utf8ToBuffer', () => {
    it('10 symbols', () => {
      const utf8 = 'abcdefg123'
      const buffer = [97, 98, 99, 100, 101, 102, 103, 49, 50, 51]
      expect(utf8ToBuffer(utf8)).toEqual(buffer)
    })
  })

  describe('base64ToBuffer', () => {
    it('10 symbols', () => {
      const base64 = 'YWJjZGVmZ2gxMjM='
      const buffer = [97, 98, 99, 100, 101, 102, 103, 104, 49, 50, 51]
      expect(base64ToBuffer(base64)).toEqual(buffer)
    })
  })

  describe('bufferToBase64', () => {
    it('10 symbols', () => {
      const buffer = [97, 98, 99, 100, 101, 102, 103, 104, 49, 50, 51]
      const base64 = 'YWJjZGVmZ2gxMjM='
      expect(bufferToBase64(buffer)).toEqual(base64)
    })
  })

  describe('complementMessage', () => {
    it('9 octets', () => {
      const originalMessage = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      const complementedMessage = [1, 2, 3, 4, 5, 6, 7, 8, 9, 128, 0, 0, 0, 0, 0, 0]
      expect(complementMessage(originalMessage)).toEqual(complementedMessage)
    })
    it('16 octets', () => {
      const originalMessage = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
      const complementedMessage = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ]
      expect(complementMessage(originalMessage)).toEqual(complementedMessage)
    })
  })

  describe('invComplementMessage', () => {
    it('9 octets', () => {
      const complementedMessage = [1, 2, 3, 4, 5, 6, 7, 8, 9, 128, 0, 0, 0, 0, 0, 0]
      const originalMessage = [1, 2, 3, 4, 5, 6, 7, 8, 9]
      expect(truncateMessage(complementedMessage)).toEqual(originalMessage)
    })
    it('16 octets', () => {
      const complementedMessage = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ]
      const originalMessage = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
      expect(truncateMessage(complementedMessage)).toEqual(originalMessage)
    })
  })

  describe('utf8ToBase64', () => {
    it('string with utf-8 symbols', () => {
      const utf8String = 'Text with emoji 😀😃😄'
      const base64String = 'VGV4dCB3aXRoIGVtb2ppIPCfmIDwn5iD8J+YhA=='
      expect(utf8ToBase64(utf8String)).toEqual(base64String)
    })
  })

  describe('base64ToUtf8', () => {
    it('string with utf-8 symbols', () => {
      const base64String = 'VGV4dCB3aXRoIGVtb2ppIPCfmIDwn5iD8J+YhA=='
      const utf8String = 'Text with emoji 😀😃😄'
      expect(base64ToUtf8(base64String)).toEqual(utf8String)
    })
  })

  describe('splitMessage', () => {
    it('48 octets', () => {
      const message = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48
      ]
      const chunks = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
        [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
      ]
      expect(splitMessage(message)).toEqual(chunks)
    })
  })

  describe('joinMessage', () => {
    it('48 octets', () => {
      const chunks = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
        [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
      ]
      const message = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48
      ]
      expect(joinMessage(chunks)).toEqual(message)
    })
  })

  describe('encryptString', () => {
    it('string with utf-8 symbols', () => {
      const key = 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY='
      const message = 'Hello World! 😀😃😄'
      const encrypted = '0E2wSxOZUrnFOeWGoBeFX8Nhj0Dw7T2eL4+4M89eLfI='

      expect(encryptString(message, key)).toEqual(encrypted)
    })
  })

  describe('decryptString', () => {
    it('string with utf-8 symbols', () => {
      const key = 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY='
      const encrypted = '0E2wSxOZUrnFOeWGoBeFX8Nhj0Dw7T2eL4+4M89eLfI='
      const message = 'Hello World! 😀😃😄'

      expect(decryptString(encrypted, key)).toEqual(message)
    })
  })

  describe('encrypt and decrypt string', () => {
    it('key from string', () => {
      const key = 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY='
      const message = 'Hello World! 😀😃😄'

      expect(decryptString(encryptString(message, key), key)).toEqual(message)
    })
    it('generated key', () => {
      const key = generateKey()
      const message = 'Hello World! 😀😃😄'

      expect(decryptString(encryptString(message, key), key)).toEqual(message)
    })
  })

  describe('generateKey', () => {
    it('key length', () => {
      const keyLength = generateKey().length
      expect(keyLength).toEqual(44)
    })
    it('last char', () => {
      const key = generateKey()
      const lastChar = key.charAt(key.length - 1)
      expect(lastChar).toEqual('=')
    })
  })
})
