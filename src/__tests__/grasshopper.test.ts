import { blocksS, transformationS } from '../grasshopper'
import { parseHexStringToBuffer } from '../utils'

describe('Grasshopper functions', () => {

  describe('transformationS', () => {
    it('empty input data', () => {
      const inputData = parseHexStringToBuffer('')
      const outputData = parseHexStringToBuffer('')
      expect(transformationS(inputData, blocksS)).toEqual(outputData)
    })
    it('8-bit input data', () => {
      const inputData = parseHexStringToBuffer('ff')
      const outputData = parseHexStringToBuffer('b6')
      expect(transformationS(inputData, blocksS)).toEqual(outputData)
    })
    it('first test case from standard', () => {
      const inputData = parseHexStringToBuffer('ffeeddccbbaa99881122334455667700')
      const outputData = parseHexStringToBuffer('b66cd8887d38e8d77765aeea0c9a7efc')
      expect(transformationS(inputData, blocksS)).toEqual(outputData)
    })
    it('second test case from standard', () => {
      const inputData = parseHexStringToBuffer('b66cd8887d38e8d77765aeea0c9a7efc')
      const outputData = parseHexStringToBuffer('559d8dd7bd06cbfe7e7b262523280d39')
      expect(transformationS(inputData, blocksS)).toEqual(outputData)
    })
    it('third test case from standard', () => {
      const inputData = parseHexStringToBuffer('559d8dd7bd06cbfe7e7b262523280d39')
      const outputData = parseHexStringToBuffer('0c3322fed531e4630d80ef5c5a81c50b')
      expect(transformationS(inputData, blocksS)).toEqual(outputData)
    })
    it('fourth test case from standard', () => {
      const inputData = parseHexStringToBuffer('0c3322fed531e4630d80ef5c5a81c50b')
      const outputData = parseHexStringToBuffer('23ae65633f842d29c5df529c13f5acda')
      expect(transformationS(inputData, blocksS)).toEqual(outputData)
    })
  })
})
