

// import { Keypair } from "@solana/web3.js";
// import * as bip39 from "@scure/bip39";
// import { HDKey } from "@scure/bip32"
// import { Buffer } from "buffer"; // Import the polyfill
// window.Buffer = Buffer; // Inject Buffer into the global scope
// import { wordlist } from "@scure/bip39/wordlists/english";
// import { hmac } from "@noble/hashes/hmac";
// import { sha512 } from "@noble/hashes/sha2";


// export function GenerateNewMnemonic() {
//     const mnemonic = bip39.generateMnemonic(wordlist);
//     return mnemonic;
// }
// export function ValidateMnemonic(mnemonic: string) {
//     const isValid = bip39.validateMnemonic(mnemonic, wordlist);
//     if (!isValid) {
//         throw new Error("Invalid mnemonic");
//     }
//     return isValid;
// }
// export function GenerateSeed(_mnemonic?: string) {
//     const mnemonic = _mnemonic || bip39.generateMnemonic(wordlist);
//     const seedString = bip39.mnemonicToSeedSync(mnemonic);
//     return seedString;
// }
// //EVM
// export function EVMDeriveChildPrivateKey(seed: string, index: number, derivationPath: string) {
//     const path = `${derivationPath}${index}'`
//     const scureNode = HDKey.fromMasterSeed(Buffer.from(seed, "hex"))
//     const child = scureNode.derive(path);
//     const privateKey = Buffer.from(child.privateKey!).toString("hex");
//     const publicKey = Buffer.from(child.publicKey!).toString("hex");
//     return { privateKey, publicKey };
// }

// //SVM
// export function SVMDeriveChildPrivateKey(seed: string, index: number, derivationPath: string) {
//     const path = `${derivationPath}${index}'`;
//     // Derive a seed from the given path
//     const derivedSeed = derivePathEclipticCurve(path, Buffer.from(seed, "hex")).key;
//     const derivedKeyPair = Keypair.fromSeed(derivedSeed);
//     return derivedKeyPair;
// }

// function derivePathEclipticCurve(path: string, seed: Uint8Array): { key: Uint8Array, chainCode: Uint8Array } {
//     const segments = path
//         .split("/")
//         .slice(1)
//         .map((seg) => {
//             if (!seg.endsWith("'")) {
//                 throw new Error("Only hardened derivation is supported");
//             }
//             return parseInt(seg.slice(0, -1), 10) + 0x80000000;
//         });

//     // Initialize with master key derivation
//     let hmacResult = hmac(sha512, Buffer.from("ed25519 seed"), seed);
//     let key = hmacResult.slice(0, 32);
//     let chainCode = hmacResult.slice(32, 64);

//     // Derive each path segment
//     for (const segment of segments) {
//         const result = hardenedDerivation(key, chainCode, segment);
//         key = Buffer.from(result.key);
//         chainCode = Buffer.from(result.chainCode);
//     }

//     return { key, chainCode };
// }

// function hardenedDerivation(
//     parentKey: Uint8Array,
//     parentChainCode: Uint8Array,
//     index: number
// ): { key: Uint8Array, chainCode: Uint8Array } {
//     const indexBuffer = new Uint8Array(4);
//     new DataView(indexBuffer.buffer).setUint32(0, index, false);

//     // Proper SLIP-0010 format: 0x00 + parent_key + index
//     const data = new Uint8Array([0x00, ...parentKey, ...indexBuffer]);

//     const hmacResult = hmac(sha512, parentChainCode, data);

//     return {
//         key: hmacResult.slice(0, 32),      // Left 32 bytes
//         chainCode: hmacResult.slice(32, 64) // Right 32 bytes
//     };
// }