// import { mnemonicToSeedSync, generateMnemonic } from "@scure/bip39";
// import { wordlist } from "@scure/bip39/wordlists/english";
// import nacl from "tweetnacl";
// import { hmac } from "../node_modules/@noble/hashes/hmac";
// import { sha512 } from "../node_modules/@noble/hashes/sha512";
// import BIP32Factory from "bip32";
// import * as ecc from "tiny-secp256k1";
// import { BIP32Interface } from "bip32";
// import { derivePath as derivePathLib } from "ed25519-hd-key";
// import { HDKey } from "@scure/bip32";


// import * as bip39_impl1 from "bip39";

// import * as ed25519 from "ed25519-hd-key";
// import { Keypair } from "@solana/web3.js";

// // Implementation 2 - Using @scure libraries with custom Ed25519
// import * as bip39_impl2 from "@scure/bip39";
// // === your SLIP-0010 implementation here ===
// // (using your derivePath + hardenedDerivation methods)


// function derivePath(path: string, seed: Uint8Array): { key: Uint8Array, chainCode: Uint8Array } {
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
//     let hmacResult = hmac(sha512, "ed25519 seed", seed);
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

// function hex(buf: Uint8Array) {
//     return Buffer.from(buf).toString("hex");
// }

// // --- Test Vector Check ---
// const vectorTest = () => {
//     const seedHex = "000102030405060708090a0b0c0d0e0f";
//     const seed = Buffer.from(seedHex, "hex");
//     const { key, chainCode } = derivePath("m/0'", seed);

//     console.log("SLIP-0010 Test Vector:");
//     console.log("Derived key:", hex(key));
//     console.log("Expected key: 68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3");
//     console.log("Derived chainCode:", hex(chainCode));
//     console.log("Expected chainCode: 8b59aa11380b624e81507a27fedda59fea6d0b779a778918a2fd3590e16e9c69");
// }

// // --- Solana Path Check ---
// const solanaPathCheck = () => {
//     const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
//     const seed = mnemonicToSeedSync(mnemonic);

//     const { key } = derivePath("m/44'/501'/0'/0'", seed);
//     const keypair = nacl.sign.keyPair.fromSeed(key);

//     console.log("\nSolana Path m/44'/501'/0'/0':");
//     console.log("Private key seed:", hex(key));
//     console.log("Public key:", hex(keypair.publicKey));
// }

// // === Test Harness ===
// const compareDerivation = () => {
//     const mnemonic = generateMnemonic(wordlist);
//     const seed = mnemonicToSeedSync(mnemonic);

//     const path = "m/44'/501'/0'/0'";

//     // Custom
//     const custom = derivePath(path, seed);
//     const customKeypair = nacl.sign.keyPair.fromSeed(custom.key);

//     // Library
//     const lib = derivePathLib(path, Buffer.from(seed).toString("hex"));
//     const libKeypair = nacl.sign.keyPair.fromSeed(lib.key);

//     console.log("=== Solana Derivation Test ===");
//     console.log("Path:", path);
//     console.log("\n-- Custom Implementation --");
//     console.log("Private key seed:", hex(custom.key));
//     console.log("Chain code:", hex(custom.chainCode));
//     console.log("Public key:", hex(customKeypair.publicKey));

//     console.log("\n-- ed25519-hd-key Library --");
//     console.log("Private key seed:", hex(lib.key));
//     console.log("Chain code:", hex(lib.chainCode));
//     console.log("Public key:", hex(libKeypair.publicKey));

//     console.log("\nMatch (private):", hex(custom.key) === hex(lib.key));
//     console.log("Match (chainCode):", hex(custom.chainCode) === hex(lib.chainCode));
//     console.log("Match (public):", hex(customKeypair.publicKey) === hex(libKeypair.publicKey));
// }

// const testBip32 = async () => {
//     const mnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
//     const seed = mnemonicToSeedSync(mnemonic);

//     const derivationPath = "m/44'/0'/0'/0"; // Bitcoin account
//     const index = 0;
//     const path = `${derivationPath}/${index}`;

//     // --- @scure/bip32 ---
//     const scureNode = HDKey.fromMasterSeed(seed);
//     const scureChild = scureNode.derive(path);

//     console.log("=== @scure/bip32 ===");
//     console.log("Path:", path);
//     console.log("Private key:", hex(scureChild.privateKey!));
//     console.log("Public key:", hex(scureChild.publicKey!));
//     console.log("Chain code:", hex(scureChild.chainCode!));

//     // --- bip32 + tiny-secp256k1 ---
//     const bip32 = BIP32Factory(ecc);
//     const node: BIP32Interface = bip32.fromSeed(Buffer.from(seed));
//     const child = node.derivePath(path);

//     console.log("\n=== bip32 (tiny-secp256k1) ===");
//     console.log("Path:", path);
//     console.log("Private key:", hex(child.privateKey!));
//     console.log("Public key:", hex(child.publicKey));
//     console.log("Chain code:", hex(child.chainCode));

//     // Compare
//     console.log("\n=== Comparison ===");
//     console.log("Private keys match:", hex(scureChild.privateKey!) === hex(child.privateKey!));
//     console.log("Public keys match:", hex(scureChild.publicKey!) === hex(child.publicKey));
//     console.log("Chain codes match:", hex(scureChild.chainCode!) === hex(child.chainCode));
// }

// // ===== IMPLEMENTATION 1 =====
// class WalletImpl1 {
//     static GenerateNewMnemonic(): string {
//         const mnemonic = bip39_impl1.generateMnemonic();
//         return mnemonic;
//     }

//     static ValidateMnemonic(mnemonic: string): boolean {
//         const isValid = bip39_impl1.validateMnemonic(mnemonic);
//         if (!isValid) {
//             throw new Error("Invalid mnemonic");
//         }
//         return isValid;
//     }

//     static GenerateSeed(_mnemonic: string): string {
//         const mnemonic = _mnemonic || bip39_impl1.generateMnemonic();
//         const seed = bip39_impl1.mnemonicToSeedSync(mnemonic);
//         const seedString = seed.toString("hex");
//         return seedString;
//     }

//     static getSeedNode(seed: string): BIP32Interface {
//         const bip32 = BIP32Factory(ecc);
//         const restoredSeedBuffer = Buffer.from(seed, "hex");
//         const node = bip32.fromSeed(restoredSeedBuffer);
//         return node;
//     }

//     static EVMDeriveChildPrivateKey(seed: string, index: number, derivationPath: string): { privateKey: string, publicKey: string } {
//         const node = this.getSeedNode(seed);
//         const child = node.derivePath(`${derivationPath}${index}'`);
//         const privateKey = child.privateKey!.toString("hex");
//         const publicKey = child.publicKey.toString("hex");
//         return { privateKey, publicKey };
//     }

//     static SVMDeriveChildPrivateKey(seed: string, index: number, derivationPath: string): { privateKey: string, publicKey: string, keypair: Keypair } {
//         const path = `${derivationPath}${index}'`;
//         const derivedSeed = ed25519.derivePath(path, seed).key;
//         const derivedKeyPair = Keypair.fromSeed(derivedSeed);
//         return {
//             privateKey: Buffer.from(derivedKeyPair.secretKey).toString("hex"),
//             publicKey: derivedKeyPair.publicKey.toString(),
//             keypair: derivedKeyPair
//         };
//     }
// }

// // ===== IMPLEMENTATION 2 =====
// class WalletImpl2 {
//     static GenerateNewMnemonic(): string {
//         const mnemonic = bip39_impl2.generateMnemonic(wordlist);
//         return mnemonic;
//     }

//     static ValidateMnemonic(mnemonic: string): boolean {
//         const isValid = bip39_impl2.validateMnemonic(mnemonic, wordlist);
//         if (!isValid) {
//             throw new Error("Invalid mnemonic");
//         }
//         return isValid;
//     }

//     static GenerateSeed(_mnemonic: string): Uint8Array {
//         const mnemonic = _mnemonic || bip39_impl2.generateMnemonic(wordlist);
//         const seedString = bip39_impl2.mnemonicToSeedSync(mnemonic);
//         return seedString;
//     }

//     static EVMDeriveChildPrivateKey(seed: string, index: number, derivationPath: string): { privateKey: string, publicKey: string } {
//         const path = `${derivationPath}${index}'`;
//         const scureNode = HDKey.fromMasterSeed(Buffer.from(seed, "hex"));
//         const child = scureNode.derive(path);
//         const privateKey = Buffer.from(child.privateKey!).toString("hex");
//         const publicKey = Buffer.from(child.publicKey!).toString("hex");
//         return { privateKey, publicKey };
//     }

//     static SVMDeriveChildPrivateKey(seed: string, index: number, derivationPath: string): { privateKey: string, publicKey: string, keypair: Keypair } {
//         const path = `${derivationPath}${index}'`;
//         const derivedSeed = this.derivePathEclipticCurve(path, Buffer.from(seed, "hex")).key;
//         const derivedKeyPair = Keypair.fromSeed(derivedSeed);
//         return {
//             privateKey: Buffer.from(derivedKeyPair.secretKey).toString("hex"),
//             publicKey: derivedKeyPair.publicKey.toString(),
//             keypair: derivedKeyPair
//         };
//     }

//     static derivePathEclipticCurve(path: string, seed: Uint8Array): { key: Uint8Array, chainCode: Uint8Array } {
//         const segments = path
//             .split("/")
//             .slice(1)
//             .map((seg) => {
//                 if (!seg.endsWith("'")) {
//                     throw new Error("Only hardened derivation is supported");
//                 }
//                 return parseInt(seg.slice(0, -1), 10) + 0x80000000;
//             });

//         let hmacResult = hmac(sha512, "ed25519 seed", seed);
//         let key = hmacResult.slice(0, 32);
//         let chainCode = hmacResult.slice(32, 64);

//         for (const segment of segments) {
//             const result = this.hardenedDerivation(key, chainCode, segment);
//             key = Buffer.from(result.key);
//             chainCode = Buffer.from(result.chainCode);
//         }

//         return { key, chainCode };
//     }

//     static hardenedDerivation(
//         parentKey: Uint8Array,
//         parentChainCode: Uint8Array,
//         index: number
//     ): { key: Uint8Array, chainCode: Uint8Array } {
//         const indexBuffer = new Uint8Array(4);
//         new DataView(indexBuffer.buffer).setUint32(0, index, false);

//         const data = new Uint8Array([0x00, ...parentKey, ...indexBuffer]);
//         const hmacResult = hmac(sha512, parentChainCode, data);

//         return {
//             key: hmacResult.slice(0, 32),
//             chainCode: hmacResult.slice(32, 64)
//         };
//     }
// }

// // ===== COMPARISON SCRIPT =====
// function compareImplementations() {
//     console.log("🔍 Comparing Wallet Implementations\n");
//     console.log("=".repeat(80));

//     // Test data
//     const testMnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
//     const evmDerivationPath = "m/44'/60'/0'/0/";
//     const svmDerivationPath = "m/44'/501'/";
//     const testIndices = [0, 1, 2, 5, 10];

//     let allTestsPassed = true;

//     try {
//         // Test 1: Mnemonic validation
//         console.log("📝 Test 1: Mnemonic Validation");
//         const valid1 = WalletImpl1.ValidateMnemonic(testMnemonic);
//         const valid2 = WalletImpl2.ValidateMnemonic(testMnemonic);

//         console.log(`   Implementation 1: ${valid1}`);
//         console.log(`   Implementation 2: ${valid2}`);
//         console.log(`   ✅ Match: ${valid1 === valid2}\n`);

//         if (valid1 !== valid2) allTestsPassed = false;

//         // Test 2: Seed generation
//         console.log("🌱 Test 2: Seed Generation");
//         const seed1 = WalletImpl1.GenerateSeed(testMnemonic);
//         const seed2 = Buffer.from(WalletImpl2.GenerateSeed(testMnemonic)).toString("hex");

//         console.log(`   Implementation 1: ${seed1.substring(0, 32)}...`);
//         console.log(`   Implementation 2: ${seed2.substring(0, 32)}...`);
//         console.log(`   ✅ Match: ${seed1 === seed2}\n`);

//         if (seed1 !== seed2) allTestsPassed = false;

//         // Test 3: EVM Key Derivation
//         console.log("⚡ Test 3: EVM Key Derivation");
//         console.log("   Index | Implementation 1 Private Key                    | Implementation 2 Private Key                    | Match");
//         console.log("   ------|--------------------------------------------------|--------------------------------------------------|------");

//         let evmMatches = true;
//         for (const index of testIndices) {
//             const evm1 = WalletImpl1.EVMDeriveChildPrivateKey(seed1, index, evmDerivationPath);
//             const evm2 = WalletImpl2.EVMDeriveChildPrivateKey(seed1, index, evmDerivationPath);

//             const privateKeyMatch = evm1.privateKey === evm2.privateKey;
//             const publicKeyMatch = evm1.publicKey === evm2.publicKey;
//             const match = privateKeyMatch && publicKeyMatch;

//             console.log(`   ${index.toString().padStart(5)} | ${evm1.privateKey.substring(0, 48)} | ${evm2.privateKey.substring(0, 48)} | ${match ? '✅' : '❌'}`);

//             if (!match) {
//                 evmMatches = false;
//                 allTestsPassed = false;
//             }
//         }
//         console.log(`   Overall EVM Match: ${evmMatches ? '✅' : '❌'}\n`);

//         // Test 4: SVM Key Derivation
//         console.log("🌞 Test 4: SVM (Solana) Key Derivation");
//         console.log("   Index | Implementation 1 Private Key                    | Implementation 2 Private Key                    | Match");
//         console.log("   ------|--------------------------------------------------|--------------------------------------------------|------");

//         let svmMatches = true;
//         for (const index of testIndices) {
//             const svm1 = WalletImpl1.SVMDeriveChildPrivateKey(seed1, index, svmDerivationPath);
//             const svm2 = WalletImpl2.SVMDeriveChildPrivateKey(seed1, index, svmDerivationPath);

//             const privateKeyMatch = svm1.privateKey === svm2.privateKey;
//             const publicKeyMatch = svm1.publicKey === svm2.publicKey;
//             const match = privateKeyMatch && publicKeyMatch;

//             console.log(`   ${index.toString().padStart(5)} | ${svm1.privateKey.substring(0, 48)} | ${svm2.privateKey.substring(0, 48)} | ${match ? '✅' : '❌'}`);

//             if (!match) {
//                 svmMatches = false;
//                 allTestsPassed = false;

//                 // Show detailed comparison for mismatches
//                 console.log(`     🔍 Detailed comparison for index ${index}:`);
//                 console.log(`     Impl1 Private: ${svm1.privateKey}`);
//                 console.log(`     Impl2 Private: ${svm2.privateKey}`);
//                 console.log(`     Impl1 Public:  ${svm1.publicKey}`);
//                 console.log(`     Impl2 Public:  ${svm2.publicKey}`);
//             }
//         }
//         console.log(`   Overall SVM Match: ${svmMatches ? '✅' : '❌'}\n`);

//         // Test 5: Performance comparison
//         console.log("⏱️  Test 5: Performance Comparison");

//         const iterations = 100;

//         // EVM Performance
//         console.time("   Implementation 1 EVM");
//         for (let i = 0; i < iterations; i++) {
//             WalletImpl1.EVMDeriveChildPrivateKey(seed1, i % 10, evmDerivationPath);
//         }
//         console.timeEnd("   Implementation 1 EVM");

//         console.time("   Implementation 2 EVM");
//         for (let i = 0; i < iterations; i++) {
//             WalletImpl2.EVMDeriveChildPrivateKey(seed1, i % 10, evmDerivationPath);
//         }
//         console.timeEnd("   Implementation 2 EVM");

//         // SVM Performance
//         console.time("   Implementation 1 SVM");
//         for (let i = 0; i < iterations; i++) {
//             WalletImpl1.SVMDeriveChildPrivateKey(seed1, i % 10, svmDerivationPath);
//         }
//         console.timeEnd("   Implementation 1 SVM");

//         console.time("   Implementation 2 SVM");
//         for (let i = 0; i < iterations; i++) {
//             WalletImpl2.SVMDeriveChildPrivateKey(seed1, i % 10, svmDerivationPath);
//         }
//         console.timeEnd("   Implementation 2 SVM");

//         console.log("\n" + "=".repeat(80));
//         console.log(`🎯 Overall Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
//         console.log("=".repeat(80));

//         return {
//             success: allTestsPassed,
//             details: {
//                 mnemonicValidation: valid1 === valid2,
//                 seedGeneration: seed1 === seed2,
//                 evmDerivation: evmMatches,
//                 svmDerivation: svmMatches
//             }
//         };

//     } catch (error: any) {
//         console.error("❌ Error during comparison:", error);
//         return {
//             success: false,
//             error: error.message
//         };
//     }
// }

// compareImplementations()