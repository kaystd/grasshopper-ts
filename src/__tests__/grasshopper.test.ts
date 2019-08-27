import {
  blocksS,
  decrypt,
  deployKeys,
  encrypt,
  galoisMultiply,
  invBlocksS,
  invTransformationL,
  invTransformationR,
  transformationC,
  transformationF,
  transformationL,
  transformationR,
  transformationS,
  transformationX,
} from '../grasshopper'
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
    it('first test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('b66cd8887d38e8d77765aeea0c9a7efc')
      const outputData = parseHexStringToBuffer('ffeeddccbbaa99881122334455667700')
      expect(transformationS(inputData, invBlocksS)).toEqual(outputData)
    })
    it('second test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('559d8dd7bd06cbfe7e7b262523280d39')
      const outputData = parseHexStringToBuffer('b66cd8887d38e8d77765aeea0c9a7efc')
      expect(transformationS(inputData, invBlocksS)).toEqual(outputData)
    })
    it('third test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('0c3322fed531e4630d80ef5c5a81c50b')
      const outputData = parseHexStringToBuffer('559d8dd7bd06cbfe7e7b262523280d39')
      expect(transformationS(inputData, invBlocksS)).toEqual(outputData)
    })
    it('fourth test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('23ae65633f842d29c5df529c13f5acda')
      const outputData = parseHexStringToBuffer('0c3322fed531e4630d80ef5c5a81c50b')
      expect(transformationS(inputData, invBlocksS)).toEqual(outputData)
    })
  })

  describe('transformationX', () => {
    it('empty input data', () => {
      const inputData = parseHexStringToBuffer('')
      const roundKey = parseHexStringToBuffer('8899aabbccddeeff0011223344556677')
      const outputData = parseHexStringToBuffer('')
      expect(transformationX(inputData, roundKey)).toEqual(outputData)
    })
    it('8-bit input data', () => {
      const inputData = parseHexStringToBuffer('11')
      const roundKey = parseHexStringToBuffer('8899aabbccddeeff0011223344556677')
      const outputData = parseHexStringToBuffer('99')
      expect(transformationX(inputData, roundKey)).toEqual(outputData)
    })
    it('first test case from standard', () => {
      const inputData = parseHexStringToBuffer('6ea276726c487ab85d27bd10dd849401')
      const roundKey = parseHexStringToBuffer('8899aabbccddeeff0011223344556677')
      const outputData = parseHexStringToBuffer('e63bdcc9a09594475d369f2399d1f276')
      expect(transformationX(inputData, roundKey)).toEqual(outputData)
    })
    it('second test case from standard', () => {
      const inputData = parseHexStringToBuffer('1122334455667700ffeeddccbbaa9988')
      const roundKey = parseHexStringToBuffer('8899aabbccddeeff0011223344556677')
      const outputData = parseHexStringToBuffer('99bb99ff99bb99ffffffffffffffffff')
      expect(transformationX(inputData, roundKey)).toEqual(outputData)
    })
  })

  describe('galoisMultiply', () => {
    it('two ones', () => {
      expect(galoisMultiply(1, 1)).toEqual(1)
    })
    it('one one', () => {
      expect(galoisMultiply(1, 148)).toEqual(148)
    })
    it('more bits', () => {
      expect(galoisMultiply(221, 148)).toEqual(137)
    })
  })

  describe('transformationR', () => {
    it('first test case from standard', () => {
      const inputData = parseHexStringToBuffer('00000000000000000000000000000100')
      const outputData = parseHexStringToBuffer('94000000000000000000000000000001')
      expect(transformationR(inputData)).toEqual(outputData)
    })
    it('second test case from standard', () => {
      const inputData = parseHexStringToBuffer('94000000000000000000000000000001')
      const outputData = parseHexStringToBuffer('a5940000000000000000000000000000')
      expect(transformationR(inputData)).toEqual(outputData)
    })
    it('third test case from standard', () => {
      const inputData = parseHexStringToBuffer('a5940000000000000000000000000000')
      const outputData = parseHexStringToBuffer('64a59400000000000000000000000000')
      expect(transformationR(inputData)).toEqual(outputData)
    })
    it('fourth test case from standard', () => {
      const inputData = parseHexStringToBuffer('64a59400000000000000000000000000')
      const outputData = parseHexStringToBuffer('0d64a594000000000000000000000000')
      expect(transformationR(inputData)).toEqual(outputData)
    })
  })

  describe('invTransformationR', () => {
    it('first test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('94000000000000000000000000000001')
      const outputData = parseHexStringToBuffer('00000000000000000000000000000100')
      expect(invTransformationR(inputData)).toEqual(outputData)
    })
    it('second test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('a5940000000000000000000000000000')
      const outputData = parseHexStringToBuffer('94000000000000000000000000000001')
      expect(invTransformationR(inputData)).toEqual(outputData)
    })
    it('third test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('64a59400000000000000000000000000')
      const outputData = parseHexStringToBuffer('a5940000000000000000000000000000')
      expect(invTransformationR(inputData)).toEqual(outputData)
    })
    it('fourth test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('0d64a594000000000000000000000000')
      const outputData = parseHexStringToBuffer('64a59400000000000000000000000000')
      expect(invTransformationR(inputData)).toEqual(outputData)
    })
  })

  describe('transformationL', () => {
    it('first test case from standard', () => {
      const inputData = parseHexStringToBuffer('64a59400000000000000000000000000')
      const outputData = parseHexStringToBuffer('d456584dd0e3e84cc3166e4b7fa2890d')
      expect(transformationL(inputData)).toEqual(outputData)
    })
    it('second test case from standard', () => {
      const inputData = parseHexStringToBuffer('d456584dd0e3e84cc3166e4b7fa2890d')
      const outputData = parseHexStringToBuffer('79d26221b87b584cd42fbc4ffea5de9a')
      expect(transformationL(inputData)).toEqual(outputData)
    })
    it('third test case from standard', () => {
      const inputData = parseHexStringToBuffer('79d26221b87b584cd42fbc4ffea5de9a')
      const outputData = parseHexStringToBuffer('0e93691a0cfc60408b7b68f66b513c13')
      expect(transformationL(inputData)).toEqual(outputData)
    })
    it('fourth test case from standard', () => {
      const inputData = parseHexStringToBuffer('0e93691a0cfc60408b7b68f66b513c13')
      const outputData = parseHexStringToBuffer('e6a8094fee0aa204fd97bcb0b44b8580')
      expect(transformationL(inputData)).toEqual(outputData)
    })
  })

  describe('invTransformationL', () => {
    it('first test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('d456584dd0e3e84cc3166e4b7fa2890d')
      const outputData = parseHexStringToBuffer('64a59400000000000000000000000000')
      expect(invTransformationL(inputData)).toEqual(outputData)
    })
    it('second test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('79d26221b87b584cd42fbc4ffea5de9a')
      const outputData = parseHexStringToBuffer('d456584dd0e3e84cc3166e4b7fa2890d')
      expect(invTransformationL(inputData)).toEqual(outputData)
    })
    it('third test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('0e93691a0cfc60408b7b68f66b513c13')
      const outputData = parseHexStringToBuffer('79d26221b87b584cd42fbc4ffea5de9a')
      expect(invTransformationL(inputData)).toEqual(outputData)
    })
    it('fourth test case from standard with inversion', () => {
      const inputData = parseHexStringToBuffer('e6a8094fee0aa204fd97bcb0b44b8580')
      const outputData = parseHexStringToBuffer('0e93691a0cfc60408b7b68f66b513c13')
      expect(invTransformationL(inputData)).toEqual(outputData)
    })
  })

  describe('transformationC', () => {
    it('first test case from standard', () => {
      const outputData = parseHexStringToBuffer('6ea276726c487ab85d27bd10dd849401')
      expect(transformationC(1)).toEqual(outputData)
    })
    it('second test case from standard', () => {
      const outputData = parseHexStringToBuffer('dc87ece4d890f4b3ba4eb92079cbeb02')
      expect(transformationC(2)).toEqual(outputData)
    })
    it('third test case from standard', () => {
      const outputData = parseHexStringToBuffer('b2259a96b4d88e0be7690430a44f7f03')
      expect(transformationC(3)).toEqual(outputData)
    })
    it('fourth test case from standard', () => {
      const outputData = parseHexStringToBuffer('7bcd1b0b73e32ba5b79cb140f2551504')
      expect(transformationC(4)).toEqual(outputData)
    })
    it('fifth test case from standard', () => {
      const outputData = parseHexStringToBuffer('156f6d791fab511deabb0c502fd18105')
      expect(transformationC(5)).toEqual(outputData)
    })
    it('sixth test case from standard', () => {
      const outputData = parseHexStringToBuffer('a74af7efab73df160dd208608b9efe06')
      expect(transformationC(6)).toEqual(outputData)
    })
    it('seventh test case from standard', () => {
      const outputData = parseHexStringToBuffer('c9e8819dc73ba5ae50f5b570561a6a07')
      expect(transformationC(7)).toEqual(outputData)
    })
    it('eighth test case from standard', () => {
      const outputData = parseHexStringToBuffer('f6593616e6055689adfba18027aa2a08')
      expect(transformationC(8)).toEqual(outputData)
    })
  })

  describe('transformationF', () => {
    it('first test case from standard', () => {
      const inputData = parseHexStringToBuffer('6ea276726c487ab85d27bd10dd849401')
      const key = [
        parseHexStringToBuffer('8899aabbccddeeff0011223344556677'),
        parseHexStringToBuffer('fedcba98765432100123456789abcdef'),
      ]
      const outputData = [
        parseHexStringToBuffer('c3d5fa01ebe36f7a9374427ad7ca8949'),
        parseHexStringToBuffer('8899aabbccddeeff0011223344556677'),
      ]
      expect(transformationF(inputData, key)).toEqual(outputData)
    })
    it('second test case from standard', () => {
      const inputData = parseHexStringToBuffer('dc87ece4d890f4b3ba4eb92079cbeb02')
      const key = [
        parseHexStringToBuffer('c3d5fa01ebe36f7a9374427ad7ca8949'),
        parseHexStringToBuffer('8899aabbccddeeff0011223344556677'),
      ]
      const outputData = [
        parseHexStringToBuffer('37777748e56453377d5e262d90903f87'),
        parseHexStringToBuffer('c3d5fa01ebe36f7a9374427ad7ca8949'),
      ]
      expect(transformationF(inputData, key)).toEqual(outputData)
    })
    it('third test case from standard', () => {
      const inputData = parseHexStringToBuffer('b2259a96b4d88e0be7690430a44f7f03')
      const key = [
        parseHexStringToBuffer('37777748e56453377d5e262d90903f87'),
        parseHexStringToBuffer('c3d5fa01ebe36f7a9374427ad7ca8949'),
      ]
      const outputData = [
        parseHexStringToBuffer('f9eae5f29b2815e31f11ac5d9c29fb01'),
        parseHexStringToBuffer('37777748e56453377d5e262d90903f87'),
      ]
      expect(transformationF(inputData, key)).toEqual(outputData)
    })
    it('fourth test case from standard', () => {
      const inputData = parseHexStringToBuffer('7bcd1b0b73e32ba5b79cb140f2551504')
      const key = [
        parseHexStringToBuffer('f9eae5f29b2815e31f11ac5d9c29fb01'),
        parseHexStringToBuffer('37777748e56453377d5e262d90903f87'),
      ]
      const outputData = [
        parseHexStringToBuffer('e980089683d00d4be37dd3434699b98f'),
        parseHexStringToBuffer('f9eae5f29b2815e31f11ac5d9c29fb01'),
      ]
      expect(transformationF(inputData, key)).toEqual(outputData)
    })
    it('fifth test case from standard', () => {
      const inputData = parseHexStringToBuffer('156f6d791fab511deabb0c502fd18105')
      const key = [
        parseHexStringToBuffer('e980089683d00d4be37dd3434699b98f'),
        parseHexStringToBuffer('f9eae5f29b2815e31f11ac5d9c29fb01'),
      ]
      const outputData = [
        parseHexStringToBuffer('b7bd70acea4460714f4ebe13835cf004'),
        parseHexStringToBuffer('e980089683d00d4be37dd3434699b98f'),
      ]
      expect(transformationF(inputData, key)).toEqual(outputData)
    })
    it('sixth test case from standard', () => {
      const inputData = parseHexStringToBuffer('a74af7efab73df160dd208608b9efe06')
      const key = [
        parseHexStringToBuffer('b7bd70acea4460714f4ebe13835cf004'),
        parseHexStringToBuffer('e980089683d00d4be37dd3434699b98f'),
      ]
      const outputData = [
        parseHexStringToBuffer('1a46ea1cf6ccd236467287df93fdf974'),
        parseHexStringToBuffer('b7bd70acea4460714f4ebe13835cf004'),
      ]
      expect(transformationF(inputData, key)).toEqual(outputData)
    })
    it('seventh test case from standard', () => {
      const inputData = parseHexStringToBuffer('c9e8819dc73ba5ae50f5b570561a6a07')
      const key = [
        parseHexStringToBuffer('1a46ea1cf6ccd236467287df93fdf974'),
        parseHexStringToBuffer('b7bd70acea4460714f4ebe13835cf004'),
      ]
      const outputData = [
        parseHexStringToBuffer('3d4553d8e9cfec6815ebadc40a9ffd04'),
        parseHexStringToBuffer('1a46ea1cf6ccd236467287df93fdf974'),
      ]
      expect(transformationF(inputData, key)).toEqual(outputData)
    })
    it('eighth test case from standard', () => {
      const inputData = parseHexStringToBuffer('f6593616e6055689adfba18027aa2a08')
      const key = [
        parseHexStringToBuffer('3d4553d8e9cfec6815ebadc40a9ffd04'),
        parseHexStringToBuffer('1a46ea1cf6ccd236467287df93fdf974'),
      ]
      const outputData = [
        parseHexStringToBuffer('db31485315694343228d6aef8cc78c44'),
        parseHexStringToBuffer('3d4553d8e9cfec6815ebadc40a9ffd04'),
      ]
      expect(transformationF(inputData, key)).toEqual(outputData)
    })
  })

  describe('deployKeys', () => {
    it('test case from standard', () => {
      const masterKey = parseHexStringToBuffer('8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef')
      const key1 = parseHexStringToBuffer('8899aabbccddeeff0011223344556677')
      const key2 = parseHexStringToBuffer('fedcba98765432100123456789abcdef')
      const key3 = parseHexStringToBuffer('db31485315694343228d6aef8cc78c44')
      const key4 = parseHexStringToBuffer('3d4553d8e9cfec6815ebadc40a9ffd04')
      const key5 = parseHexStringToBuffer('57646468c44a5e28d3e59246f429f1ac')
      const key6 = parseHexStringToBuffer('bd079435165c6432b532e82834da581b')
      const key7 = parseHexStringToBuffer('51e640757e8745de705727265a0098b1')
      const key8 = parseHexStringToBuffer('5a7925017b9fdd3ed72a91a22286f984')
      const key9 = parseHexStringToBuffer('bb44e25378c73123a5f32f73cdb6e517')
      const key10 = parseHexStringToBuffer('72e9dd7416bcf45b755dbaa88e4a4043')
      const iterativeKeys = [key1, key2, key3, key4, key5, key6, key7, key8, key9, key10]
      expect(deployKeys(masterKey)).toEqual(iterativeKeys)
    })
  })

  describe('encrypt', () => {
    it('test case from standard', () => {
      const plainText = parseHexStringToBuffer('1122334455667700ffeeddccbbaa9988')
      const key = parseHexStringToBuffer('8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef')
      const cipherText = parseHexStringToBuffer('7f679d90bebc24305a468d42b9d4edcd')
      expect(encrypt(plainText, key)).toEqual(cipherText)
    })
  })

  describe('decrypt', () => {
    it('test case from standard', () => {
      const cypherText = parseHexStringToBuffer('7f679d90bebc24305a468d42b9d4edcd')
      const key = parseHexStringToBuffer('8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef')
      const plainText = parseHexStringToBuffer('1122334455667700ffeeddccbbaa9988')
      expect(decrypt(cypherText, key)).toEqual(plainText)
    })
  })
})
