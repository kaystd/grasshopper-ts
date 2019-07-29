/**
 * Converts a hexadecimal string to an array of 8-bit unsigned integer values
 * @param hexString
 */
export const parseHexStringToBuffer = (hexString: string): number[] => {
  const list: string[] | null = hexString.match(/.{1,2}/g)

  return list ? list.map(s => Number(`0x${s}`)) : []
}
