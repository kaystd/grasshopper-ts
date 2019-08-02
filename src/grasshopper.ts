import { curryTwoFlip, pipe } from './utils'

/**
 * S-blocks
 */
export const blocksS: number[] = [
  252, 238, 221, 17, 207, 110, 49, 22, 251, 196, 250, 218, 35, 197, 4, 77, 233,
  119, 240, 219, 147, 46, 153, 186, 23, 54, 241, 187, 20, 205, 95, 193, 249, 24, 101,
  90, 226, 92, 239, 33, 129, 28, 60, 66, 139, 1, 142, 79, 5, 132, 2, 174, 227, 106, 143,
  160, 6, 11, 237, 152, 127, 212, 211, 31, 235, 52, 44, 81, 234, 200, 72, 171, 242, 42,
  104, 162, 253, 58, 206, 204, 181, 112, 14, 86, 8, 12, 118, 18, 191, 114, 19, 71, 156,
  183, 93, 135, 21, 161, 150, 41, 16, 123, 154, 199, 243, 145, 120, 111, 157, 158, 178,
  177, 50, 117, 25, 61, 255, 53, 138, 126, 109, 84, 198, 128, 195, 189, 13, 87, 223,
  245, 36, 169, 62, 168, 67, 201, 215, 121, 214, 246, 124, 34, 185, 3, 224, 15, 236,
  222, 122, 148, 176, 188, 220, 232, 40, 80, 78, 51, 10, 74, 167, 151, 96, 115, 30, 0,
  98, 68, 26, 184, 56, 130, 100, 159, 38, 65, 173, 69, 70, 146, 39, 94, 85, 47, 140, 163,
  165, 125, 105, 213, 149, 59, 7, 88, 179, 64, 134, 172, 29, 247, 48, 55, 107, 228, 136,
  217, 231, 137, 225, 27, 131, 73, 76, 63, 248, 254, 141, 83, 170, 144, 202, 216, 133,
  97, 32, 113, 103, 164, 45, 43, 9, 91, 203, 155, 37, 208, 190, 229, 108, 82, 89, 166,
  116, 210, 230, 244, 180, 192, 209, 102, 175, 194, 57, 75, 99, 182
]

/**
 * Constants for linear transformation
 */
const linearConstants = [148, 32, 133, 16, 194, 192, 1, 251, 1, 192, 194, 16, 133, 32, 148, 1]

/**
 * Nonlinear bijective transformation
 * @param inputData
 * @param blocks
 */
export const transformationS = (inputData: number[], blocks: number[]): number[] => {
  const outputData = Array(inputData.length).fill(0)

  return outputData.map((v, i) => blocks[inputData[i]])
}

/**
 * Modulo 2 round key addition
 * @param inputData
 * @param roundKey
 */
export const transformationX = (inputData: number[], roundKey: number[]): number[] => {
  const outputData = Array(inputData.length).fill(0)

  return outputData.map((v, i) => inputData[i] ^ roundKey[i])
}

/**
 * Multiplication in field x^8 + x^7 + x^6 + x + 1
 * @param lhs
 * @param rhs
 */
export const galoisMultiply = (lhs: number, rhs: number): number => {
  let result = 0
  let modulus = 0x1c3 << 7

  for (let detector = 0x1; detector !== 0x100; detector <<= 1, lhs <<= 1) {
    if (rhs & detector) { result ^= lhs }
  }
  for (let detector = 0x8000; detector !== 0x80; detector >>= 1, modulus >>= 1) {
    if (result & detector) { result ^= modulus }
  }
  return result
}

/**
 * Linear feedback shift register
 * @param inputData
 */
export const transformationR = (inputData: number[]): number[] => {
  const firstElement = Array(inputData.length)
    .fill(0)
    .reduce((a, v, i) => a ^ galoisMultiply(inputData[i], linearConstants[i]), 0)

  return [firstElement].concat(inputData.map((v, i, arr) => arr[i - 1]).slice(1))
}

/**
 * Linear transformation
 * @param inputData
 */
export const transformationL = (inputData: number[]): number[] => {
  const outputData = Array(16).fill(0)

  return outputData.reduce((a, v) => transformationR(a), inputData)
}

/**
 * Getting iteration constants
 * @param inputNumber
 */
export const transformationC = (inputNumber: number): number[] => {
  const array = Array(16).fill(0).map((v, i) => i === 15 ? inputNumber : v)

  return transformationL(array)
}

/**
 * F transformation
 * @param inputData
 * @param key
 */
export const transformationF = (inputData: number[], key: number[][]): number[][] => {
  const curriedTransformationS = curryTwoFlip(transformationS)(blocksS)
  const curriedTransformationX = curryTwoFlip(transformationX)(key[1])

  const transformResult =
    pipe(transformationX, curriedTransformationS, transformationL, curriedTransformationX )(inputData, key[0])

  return [transformResult, key[0]]
}

/**
 * Key deployment
 * @param masterKey
 */
export const deployKeys = (masterKey: number[]): number[][] => {
  const iterativeKeys = [masterKey.slice(0, 16), masterKey.slice(16, 32)]

  return  Array(4).fill(0).reduce((extAcc, extVal, extInd) => {
    const keyPair = Array(8).fill(0).reduce(
      (intAcc, intVal, intInd) => transformationF(transformationC(8 * extInd + intInd + 1), intAcc),
      [extAcc[extInd * 2], extAcc[extInd * 2 + 1]]
    )

    return extAcc.concat([keyPair[0]]).concat([keyPair[1]])
  }, iterativeKeys)
}
