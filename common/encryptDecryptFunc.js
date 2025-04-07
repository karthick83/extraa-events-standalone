import { AES } from "crypto-js";
import CryptoJS from 'crypto-js';
// Decoding & decrypting url to String
export const decodeAndDecrypt = (encodedText, secretKey) => {
  const code=encodedText.replace('"','')
    const base64Decoded = CryptoJS.enc.Base64.parse(base64UrlDecode(code)).toString(CryptoJS.enc.Utf8);
    const decrypted = CryptoJS.AES.decrypt(base64Decoded, secretKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  };
  const base64UrlDecode = (data) => {
    data = data.replace(/-/g, '+').replace(/_/g, '/');
    while (data.length % 4) {
      data += '=';
    }
    return data;
  };
// encoding & encrypting url to Base 64 to remove special characters
  export const encryptAndEncode = (text, secretKey) => {
    const encrypted = CryptoJS.AES.encrypt(text, secretKey).toString();
    const base64Encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encrypted));
    return base64UrlEncode(base64Encoded);
  }; 
  const base64UrlEncode = (data) => {
    return data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };
  