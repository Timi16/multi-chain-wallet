import { generateKey } from "crypto";


import base58 from "bs58";
import { NATIVE_MINT } from "@solana/spl-token";
// import { GenerateNewMnemonic } from "./bip32";
import { SVMChainWallet, SVMVM } from "./svm";
import { VM } from "./vm";
import { ChainWalletConfig } from "./types";
import { Keypair } from ".";
// const mnemonic = GenerateNewMnemonic()


// console.log('mnemonic: ', mnemonic);

// const seed = VM.mnemonicToSeed(mnemonic)
const pKey = "4QxETeX9pndiF1XNghUiDTnZnHq3cfjmuPLBJysrgocsLq1yb8w96aPWALa8ZnRZWmDU4wM8Tg8d1ZRVVByj7uXE"

export const testUserKeyPair = Keypair.fromSecretKey(base58.decode(pKey));
const x = testUserKeyPair instanceof Keypair;
// const vm = new SVMVM(seed)


// const vmFromMnemonic = SVMVM.fromMnemonic(mnemonic)
// const keyFromMnemonic = vmFromMnemonic.generatePrivateKey(0)
// console.log('keyFromMnemonic: ', keyFromMnemonic.privateKey.publicKey);
// const key = vm.generatePrivateKey(0)
// console.log('key: ', key.privateKey.publicKey);
const chainConfig: ChainWalletConfig = {
    chainId: "solana-mainnet",
    name: "Solana",
    rpcUrl: "https://solana-mainnet.g.alchemy.com/v2/vB5mKztdJeFdz9RkW99Qf",
    explorerUrl: "https://explorer.solana.com",
    nativeToken: { name: "Solana", symbol: "SOL", decimals: 9 },
    confirmationNo: 1,

}

const evmChainConfig: ChainWalletConfig = {
    chainId: "evm-mainnet",
    name: "Ethereum",
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/vB5mKztdJeFdz9RkW99Qf",
    explorerUrl: "https://explorer.ethereum.com",
    nativeToken: { name: "Ethereum", symbol: "ETH", decimals: 18 },
    confirmationNo: 1,
}


const wallet = new SVMChainWallet(chainConfig, testUserKeyPair, 0)
// console.log('wallet: ', wallet);

wallet.getNativeBalance().then(e => console.log('native balance: ', e))
// const toBuy = new PublicKey("9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump")
// wallet.swap({
//     name: NATIVE_MINT.toBase58(),
//     address: NATIVE_MINT.toBase58(),
//     symbol: NATIVE_MINT.toBase58(),
//     decimals: 9
// }, toBuy, 0.005,).then(res => console.log(res))


// console.log('wal: ', wal.address);
// wal.getNativeBalance().then(e => console.log(e))


