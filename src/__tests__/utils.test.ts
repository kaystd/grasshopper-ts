import { parseHexStringToBuffer } from '../utils'

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
})
