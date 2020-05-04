const CryptoJS = require('crypto-js')

const key = CryptoJS.enc.Utf8.parse('NNxYjV@#!185Z=V+txYjV@#!')
const iv = CryptoJS.enc.Utf8.parse('d9f16df379426e1a7d9c212008de90fa')
console.log(key)
console.log(iv)
// const mode = CryptoJS.mode.CFB
// const padding = CryptoJS.pad.Pkcs7
// 解密方法
function decrypt (word) {
  return word
  // let encryptedHexStr = CryptoJS.enc.Hex.parse('d01668f7b9b392173f0e9c0902fd7fa6564eba82')
  // let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  // let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  // let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv, mode, padding })
  // let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  // return decryptedStr.toString()
}

// 加密方法
function encrypt (word) {
  return word
  // let srcs = CryptoJS.enc.Utf8.parse(word)
  // let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv, mode, padding })
  // return encrypted.ciphertext.toString()
}

export {
  decrypt,
  encrypt
}
