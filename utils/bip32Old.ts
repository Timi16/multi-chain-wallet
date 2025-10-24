// /* eslint-disable @typescript-eslint/no-explicit-any */
// import * as bip39 from "@scure/bip39";
// import { } from "@scure/bip32"
// import { Buffer } from "buffer"; // Import the polyfill
// window.Buffer = Buffer; // Inject Buffer into the global scope

// import CryptoJS from "crypto-js";
// import { wordlist } from "@scure/bip39/wordlists/english";
// import { hmac } from "@noble/hashes/hmac";
// import { sha512 } from "@noble/hashes/sha2";

// import {
//     Keypair,
//     LAMPORTS_PER_SOL,
//     Connection,
//     PublicKey,
//     TransactionInstruction,
//     SystemProgram,
//     TransactionMessage,
//     VersionedTransaction,
//     Transaction,
//     PublicKeyInitData,
//     sendAndConfirmTransaction,
//     ComputeBudgetProgram,
//     MessageV0,
//     TransactionExpiredBlockheightExceededError,
//     BlockhashWithExpiryBlockHeight,
//     VersionedTransactionResponse,
//     Commitment,
// } from "@solana/web3.js";

// // import bs58 from "bs58";
// // import { Buffer } from "buffer";
// // import * as ed25519 from "ed25519-hd-key";

// import promiseRetry from "promise-retry";
// // import CryptoJS from "crypto-js";

// import {
//     getAssociatedTokenAddress,
//     getAccount,
//     Account,
// } from "@solana/spl-token";

// interface IAddress {
//     address: string;
//     index: number;
// }

// export type TransactionSenderAndConfirmationWaiterArgs = {
//     connection: Connection;
//     serializedTransaction: Buffer;
//     blockhashWithExpiryBlockHeight: BlockhashWithExpiryBlockHeight;
// };

// export interface Chain {
//     name: string;
//     symbol: string;
//     chainDecimals: string;
//     explorer: string;
//     http: string[];
//     ws: string;
//     nativeTokenProfitSpreed: string;
//     chainTokenExplorer: string;
//     isEvm: boolean;
//     isDevnet: boolean;
// }

// export const chain: Chain = {
//     name: "SOON TESTNET",
//     symbol: "SOON",
//     chainDecimals: LAMPORTS_PER_SOL.toString(),
//     explorer: "https://explorer.testnet.soo.network",
//     http: ["https://rpc.testnet.soo.network/rpc"],
//     ws: "",
//     nativeTokenProfitSpreed: "0.04",
//     chainTokenExplorer: "https://explorer.testnet.soo.network/",
//     isEvm: false,
//     isDevnet: true,
// };
// class MasterSmartWalletClass {
//     // Define the type for the config object
//     chain: Chain;
//     connection: Connection;
//     masterKeyPair: { privateKey: Uint8Array; publicKey: string };
//     isDevnet: boolean = false;
//     seed: string;
//     masterAddress: string;

//     constructor(mnemonic: string, chain: Chain) {
//         const seed = bip39.mnemonicToSeedSync(mnemonic);
//         this.seed = seed.toString();
//         this.chain = chain;
//         const nn = Math.floor(Math.random() * this.chain.http.length);
//         this.connection = new Connection(this.chain.http[nn], "confirmed");
//         this.masterKeyPair = this.deriveChildPrivateKey(0);
//         this.isDevnet = this.chain.isDevnet;
//         this.masterAddress = this.masterKeyPair.publicKey;
//     }
//     // static validateAddress(address: string) {
//     //     try {
//     //         new PublicKey(address);
//     //         return true;
//     //     } catch (e) {
//     //         console.log("e: ", e);
//     //         return false;
//     //     }
//     // }

//     // validateAddress(address: string) {
//     //     try {
//     //         new PublicKey(address);
//     //         return true;
//     //     } catch (e) {
//     //         console.log("e: ", e);
//     //         return false;
//     //     }
//     // }
//     // static async createSendConfirmRetryDeserializedTransaction(
//     //     deserializedBuffer: Buffer,
//     //     senderKeypairs: Keypair[],
//     //     connection: Connection,
//     //     latestBlockhash: Readonly<{
//     //         blockhash: string;
//     //         lastValidBlockHeight: number;
//     //     }>
//     // ) {
//     //     let status = false;

//     //     const transaction = VersionedTransaction.deserialize(deserializedBuffer);
//     //     transaction.sign(senderKeypairs);

//     //     const explorerUrl = "";

//     //     console.log("sending transaction...");

//     //     // We first simulate whether the transaction would be successful
//     //     const { value: simulatedTransactionResponse } =
//     //         await connection.simulateTransaction(transaction, {
//     //             replaceRecentBlockhash: true,
//     //             commitment: "processed",
//     //         });
//     //     const { err, logs } = simulatedTransactionResponse;

//     //     if (err) {
//     //         // Simulation error, we can check the logs for more details
//     //         // If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
//     //         console.error("Simulation Error:");
//     //         console.error(err);

//     //         console.error(logs);

//     //         return { status, error: err };
//     //     }

//     //     // Execute the transaction

//     //     const serializedTransaction = Buffer.from(transaction.serialize());
//     //     const blockhash = transaction.message.recentBlockhash;
//     //     console.log("blockhash: ", blockhash);

//     //     const transactionResponse = await transactionSenderAndConfirmationWaiter({
//     //         connection,
//     //         serializedTransaction,
//     //         blockhashWithExpiryBlockHeight: {
//     //             blockhash,
//     //             lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
//     //         },
//     //     });

//     //     // If we are not getting a response back, the transaction has not confirmed.
//     //     if (!transactionResponse) {
//     //         console.error("Transaction not confirmed");
//     //         // !WE SHOULD RETRY THE TRANSACTION AGAIN HERE

//     //         throw new TransactionNotConfirmedError({});
//     //     }

//     //     if (transactionResponse.meta?.err) {
//     //         console.error(transactionResponse.meta?.err);
//     //     }

//     //     console.log("View transaction on explorer:", explorerUrl);
//     //     status = true;
//     //     return { status, signature: transactionResponse.transaction.signatures };
//     // }
//     static generateSalt(): string {
//         return CryptoJS.lib.WordArray.random(16).toString(); // 128-bit salt
//     }

//     static deriveKey(
//         password: string,
//         salt: string,
//         iterations = 10000,
//         keySize = 256 / 32
//     ) {
//         return CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
//             keySize: keySize,
//             iterations: iterations,
//         }).toString();
//     }

//     static encryptSeedPhrase(seedPhrase: string, password: string) {
//         const salt = this.generateSalt(); // Generate a unique salt for this encryption
//         const key = this.deriveKey(password, salt); // Derive a key using PBKDF2

//         // Encrypt the seed phrase with AES using the derived key
//         const encrypted = CryptoJS.AES.encrypt(seedPhrase, key).toString();

//         // Return the encrypted data and the salt (needed for decryption)
//         return { encrypted, salt };
//     }
//     static decryptSeedPhrase(
//         encryptedSeedPhrase: string,
//         password: string,
//         salt: string
//     ) {
//         try {
//             const key = this.deriveKey(password, salt); // Derive the key using the same salt
//             const bytes = CryptoJS.AES.decrypt(encryptedSeedPhrase, key);
//             const seedPhrase = bytes.toString(CryptoJS.enc.Utf8);

//             // Check if decryption was successful
//             if (!seedPhrase) throw new Error("Decryption failed.");
//             return seedPhrase;
//         } catch (e: any) {
//             console.error("Invalid password or corrupted data:", e.message);
//             return null;
//         }
//     }
//     // getNativeBalance = async () => {
//     //     const connection = new Connection(
//     //         this.chain.http[Math.floor(Math.random() * this.chain.http.length)]
//     //     );
//     //     try {
//     //         const publicKey = new PublicKey(this.masterAddress);
//     //         const bal = await connection.getBalance(publicKey);
//     //         return bal / LAMPORTS_PER_SOL;
//     //     } catch (error: any) {
//     //         console.log("error: ", error);
//     //         console.log("error message: ", error.message);
//     //         throw new Error(
//     //             `the address passed is not a valid solana address : ${this.masterAddress}`
//     //         );
//     //     }
//     // };

//     // getTokenBalance = async (token: string) => {
//     //     try {
//     //         // Get the balance from the token account
//     //         const tokenAccount = await this._getTokenAccountAccount(token);
//     //         console.log("token: ", token);
//     //         const tokenBalance = await this.connection.getTokenAccountBalance(
//     //             tokenAccount.address
//     //         );

//     //         console.log(`User Token Balance: ${tokenBalance.value.uiAmount}`);
//     //         //convert tokenBalance bigInt to decimal

//     //         const tokenBalanceDecimal = tokenBalance.value.uiAmount;
//     //         if (tokenBalanceDecimal == null) {
//     //             throw new Error("could not get balance");
//     //         }
//     //         return tokenBalanceDecimal / LAMPORTS_PER_SOL;
//     //     } catch (error) {
//     //         console.log("error: ", error);
//     //         return 0;
//     //     }
//     // };

//     // _getTokenAccountAccount = async (token: string): Promise<Account> => {
//     //     try {
//     //         // Create PublicKey objects for user and token mint
//     //         const userPublicKeyObj = new PublicKey(this.masterAddress);
//     //         const tokenMintAddressObj = new PublicKey(token);

//     //         // Get the associated token account address for the user and the token mint
//     //         const associatedTokenAccount = await getAssociatedTokenAddress(
//     //             tokenMintAddressObj, // The token mint address
//     //             userPublicKeyObj // The user's public key
//     //         );

//     //         // Fetch the token account information
//     //         const tokenAccount = await getAccount(
//     //             this.connection,
//     //             associatedTokenAccount
//     //         );

//     //         return tokenAccount;
//     //     } catch (error) {
//     //         console.error("Error getting token balance:", error);
//     //         throw error;
//     //     }
//     // };
//     // async createSendConfirmRetryDeserializedTransaction(
//     //     deserializedBuffer: Buffer,
//     //     senderKeypairs: Keypair[],
//     //     connection: Connection,
//     //     latestBlockhash: Readonly<{
//     //         blockhash: string;
//     //         lastValidBlockHeight: number;
//     //     }>
//     // ) {
//     //     let status = false;

//     //     const transaction = VersionedTransaction.deserialize(deserializedBuffer);
//     //     transaction.sign(senderKeypairs);

//     //     let explorerUrl = "";

//     //     console.log("sending transaction...");

//     //     // We first simulate whether the transaction would be successful
//     //     const { value: simulatedTransactionResponse } =
//     //         await connection.simulateTransaction(transaction, {
//     //             replaceRecentBlockhash: true,
//     //             commitment: "processed",
//     //         });
//     //     const { err, logs } = simulatedTransactionResponse;

//     //     if (err) {
//     //         // Simulation error, we can check the logs for more details
//     //         // If you are getting an invalid account error, make sure that you have the input mint account to actually swap from.
//     //         console.error("Simulation Error:");
//     //         console.error(err);

//     //         console.error(logs);

//     //         return { status, error: err };
//     //     }

//     //     // Execute the transaction

//     //     const serializedTransaction = Buffer.from(transaction.serialize());
//     //     const blockhash = transaction.message.recentBlockhash;
//     //     console.log("blockhash: ", blockhash);

//     //     const transactionResponse = await transactionSenderAndConfirmationWaiter({
//     //         connection,
//     //         serializedTransaction,
//     //         blockhashWithExpiryBlockHeight: {
//     //             blockhash,
//     //             lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
//     //         },
//     //     });

//     //     // If we are not getting a response back, the transaction has not confirmed.
//     //     if (!transactionResponse) {
//     //         console.error("Transaction not confirmed");
//     //         //!WE SHOULD RETRY THE TRANSACTION AGAIN HERE

//     //         throw new TransactionNotConfirmedError({});
//     //     }

//     //     if (transactionResponse.meta?.err) {
//     //         console.error(transactionResponse.meta?.err);
//     //     }

//     //     explorerUrl = `${this.chain.explorer}/tx/${transactionResponse.transaction.signatures}`;
//     //     console.log("View transaction on explorer:", explorerUrl);
//     //     status = true;
//     //     return {
//     //         signature: `${transactionResponse.transaction.signatures}`,
//     //         status,
//     //     };
//     // }
//     // async sendTransaction(
//     //     recipientAddress: string,
//     //     amount: number,
//     //     senderSecretKey: Uint8Array
//     // ) {
//     //     /**
//     //      * internal method for sending sol transaction
//     //      */
//     //     const connection = this.connection;
//     //     const senderKeypair = Keypair.fromSecretKey(senderSecretKey);

//     //     try {
//     //         new PublicKey(recipientAddress);
//     //     } catch (error: any) {
//     //         console.log(
//     //             "the recipientAddress is not a valid public key",
//     //             recipientAddress
//     //         );
//     //         throw new error();
//     //     }

//     //     const senderBalance = await connection.getBalance(senderKeypair.publicKey);
//     //     console.log("senderBalance: ", senderBalance);

//     //     if (senderBalance < amount * LAMPORTS_PER_SOL) {
//     //         console.log(
//     //             "insufficient funds: sender balance is less than the amount to send"
//     //         );
//     //         throw new Error(
//     //             "insufficient funds: sender balance is less than the amount to send"
//     //         );
//     //     }
//     //     const amountPlusFees = amount * LAMPORTS_PER_SOL + 20045;

//     //     if (senderBalance < amountPlusFees) {
//     //         console.log(
//     //             "insufficient funds + gass : sender balance is less than the amount  Plus gass to send"
//     //         );
//     //         throw new Error(
//     //             "insufficient funds + gass : sender balance is less than the amount  Plus gass to send"
//     //         );
//     //     }
//     //     // request a specific compute unit budget
//     //     const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
//     //         units: 1500,
//     //     });

//     //     // set the desired priority fee
//     //     const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
//     //         microLamports: 30000,
//     //     });
//     //     const instructions: TransactionInstruction[] = [
//     //         addPriorityFee,
//     //         modifyComputeUnits,
//     //         SystemProgram.transfer({
//     //             fromPubkey: senderKeypair.publicKey,
//     //             toPubkey: new PublicKey(recipientAddress),
//     //             lamports: LAMPORTS_PER_SOL * amount,
//     //         }),
//     //     ];

//     //     const latestBlockhash = await connection.getLatestBlockhash();

//     //     const messageV0 = new TransactionMessage({
//     //         payerKey: senderKeypair.publicKey,
//     //         recentBlockhash: latestBlockhash.blockhash,
//     //         instructions,
//     //     }).compileToV0Message();

//     //     return await this.createSendConfirmRetryTransaction(
//     //         messageV0,
//     //         [senderKeypair],
//     //         connection,
//     //         latestBlockhash,
//     //         senderKeypair,
//     //         instructions
//     //     );
//     // }
//     // async SendTransaction(recipientAddress: string, amount: number) {
//     //     /**
//     //      * master wallet sends a transaction to @param recipientAddress of @param amount
//     //      */
//     //     const masterKeyPair = this.masterKeyPair.privateKey;
//     //     return await this.sendTransaction(recipientAddress, amount, masterKeyPair);
//     // }

//     // async getAddressWithBalance(addresses: IAddress[], connection: Connection) {
//     //     const rentExemptionThreshold =
//     //         await connection.getMinimumBalanceForRentExemption(0);
//     //     const addressThatHasBalance: IAddress[] = [];
//     //     for (const address of addresses) {
//     //         const senderBalance = await connection.getBalance(
//     //             new PublicKey(address.address)
//     //         );

//     //         if (senderBalance > rentExemptionThreshold) {
//     //             addressThatHasBalance.push(address);
//     //         }
//     //     }
//     //     return addressThatHasBalance;
//     // }

//     // async sweepBatchTransaction(
//     //     destinationAddress: string,
//     //     sendersPrivateKeys: Uint8Array[]
//     // ) {
//     //     const connection: Connection = this.connection;
//     //     const masterKeys = this.masterKeyPair;
//     //     let recipientPublicKey: PublicKey;
//     //     try {
//     //         recipientPublicKey = new PublicKey(destinationAddress);
//     //     } catch (error: unknown) {
//     //         console.error(
//     //             "The recipient address is not a valid public key:",
//     //             masterKeys.publicKey
//     //         );
//     //         throw error;
//     //     }

//     //     const senderKeypairs: Keypair[] = [];

//     //     for (const senderPrivateKey of sendersPrivateKeys) {
//     //         const senderKeypair = Keypair.fromSecretKey(senderPrivateKey);
//     //         senderKeypairs.push(senderKeypair);
//     //     }

//     //     // const GAS_FEE = 5000; // Adjusted gas fee  5005000
//     //     const rentExemptionThreshold =
//     //         await connection.getMinimumBalanceForRentExemption(0);

//     //     // Request a specific compute unit budget
//     //     const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
//     //         units: 1500,
//     //     });
//     //     // Set the desired priority fee
//     //     const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
//     //         microLamports: 30000, // Adjusted priority fee 10000000000
//     //     });

//     //     const initialInstructions: TransactionInstruction[] = [
//     //         modifyComputeUnits,
//     //         addPriorityFee,
//     //     ];

//     //     for (const senderKeypair of senderKeypairs) {
//     //         const senderBalance = await connection.getBalance(
//     //             senderKeypair.publicKey
//     //         );
//     //         const amountToSend = senderBalance - rentExemptionThreshold;

//     //         if (amountToSend > 0) {
//     //             const transferInstruction: TransactionInstruction =
//     //                 SystemProgram.transfer({
//     //                     fromPubkey: senderKeypair.publicKey,
//     //                     toPubkey: recipientPublicKey,
//     //                     lamports: amountToSend,
//     //                 });
//     //             initialInstructions.push(transferInstruction);
//     //         } else {
//     //             console.log(
//     //                 `Skipping ${senderKeypair.publicKey.toBase58()} due to insufficient funds after rent exemption`
//     //             );
//     //         }
//     //     }

//     //     if (initialInstructions.length === 2) {
//     //         throw new Error(
//     //             "No valid transfer instructions. Ensure senders have sufficient balances."
//     //         );
//     //     }

//     //     const latestBlockhash = await connection.getLatestBlockhash();

//     //     const masterKeypair = Keypair.fromSecretKey(masterKeys.privateKey);
//     //     senderKeypairs.push(masterKeypair);

//     //     const messageV0 = new TransactionMessage({
//     //         payerKey: masterKeypair.publicKey,
//     //         recentBlockhash: latestBlockhash.blockhash,
//     //         instructions: initialInstructions,
//     //     }).compileToV0Message();

//     //     //create, send, confirm,retry a new trasaction
//     //     await this.createSendConfirmRetryTransaction(
//     //         messageV0,
//     //         senderKeypairs,
//     //         connection,
//     //         latestBlockhash,
//     //         masterKeypair,
//     //         initialInstructions
//     //     );
//     // }
//     // async withdrawToMasterAddress(addresses: IAddress[]) {
//     //     /**
//     //      * @param addresses this is the list of All addresses that exist
//     //      */

//     //     const addressThatHasBalance = await this.getAddressWithBalance(
//     //         addresses,
//     //         this.connection
//     //     );

//     //     try {
//     //         const privateKeysOfAddressThatHasBalance =
//     //             this.solGetPrivateKeyFromAddressArray(
//     //                 addressThatHasBalance as IAddress[]
//     //             );
//     //         this.sweepBatchTransaction(
//     //             this.masterKeyPair.publicKey.toString(),
//     //             privateKeysOfAddressThatHasBalance
//     //         );
//     //     } catch (error) {
//     //         console.log(
//     //             "error:solGetPrivateKeyFromAddressArray orsweepBatchTransaction  ",
//     //             error
//     //         );
//     //     }
//     // }
//     // async withdrawToSpecificAddress(addresses: IAddress[], address: string) {
//     //     /**
//     //      * @param addresses this is the list of All addresses that exist
//     //      */

//     //     let addr: PublicKey;
//     //     try {
//     //         addr = new PublicKey(address);

//     //         const addressThatHasBalance = await this.getAddressWithBalance(
//     //             addresses,
//     //             this.connection
//     //         );
//     //         console.log("addressThatHasBalance: ", addressThatHasBalance);

//     //         const privateKeysOfAddressThatHasBalance =
//     //             this.solGetPrivateKeyFromAddressArray(addressThatHasBalance);
//     //         this.sweepBatchTransaction(
//     //             addr.toString(),
//     //             privateKeysOfAddressThatHasBalance
//     //         );
//     //     } catch (error) {
//     //         console.log("error: not a valid address ", error);
//     //     }
//     // }

//     // async createSendConfirmRetryTransaction(
//     //     messageV0: MessageV0,
//     //     senderKeypairs: Keypair[],
//     //     connection: Connection,
//     //     latestBlockhash: Readonly<{
//     //         blockhash: string;
//     //         lastValidBlockHeight: number;
//     //     }>,

//     //     feePayerKeypair: Keypair,
//     //     initialInstructions: TransactionInstruction[]
//     // ) {
//     //     const transaction = new VersionedTransaction(messageV0);
//     //     transaction.sign(senderKeypairs);
//     //     let signature: string;
//     //     let retries = 5;
//     //     let explorerUrl = "";

//     //     while (retries > 0) {
//     //         try {
//     //             console.log("sending transaction...");
//     //             signature = await connection.sendTransaction(transaction, {
//     //                 maxRetries: 3,
//     //             });

//     //             const confirmation = await connection.confirmTransaction({
//     //                 signature,
//     //                 blockhash: latestBlockhash.blockhash,
//     //                 lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
//     //             });

//     //             if (confirmation.value.err) {
//     //                 console.error("An error occurred:", confirmation.value.err);
//     //             } else {
//     //                 explorerUrl = `${this.chain.explorer}/tx/${signature}`;
//     //                 console.log("View transaction on explorer:", explorerUrl);
//     //             }
//     //             return { status: true, signature: `${signature}`, explorerUrl };
//     //             break; // If successful, exit the loop
//     //         } catch (error: any) {
//     //             if (error.message.includes("block height exceeded")) {
//     //                 retries -= 1;
//     //                 if (retries === 0) {
//     //                     console.error(
//     //                         "Failed to send transaction after multiple retries due to TransactionExpiredBlockheightExceededError:",
//     //                         error
//     //                     );
//     //                     throw error;
//     //                 } else {
//     //                     console.log(
//     //                         "Retrying transaction due to TransactionExpiredBlockheightExceededError: block height exceeded ..."
//     //                     );
//     //                     // Update latestBlockhash for retry
//     //                     latestBlockhash = await connection.getLatestBlockhash();
//     //                     const newMessageV0 = new TransactionMessage({
//     //                         payerKey: feePayerKeypair.publicKey,
//     //                         recentBlockhash: latestBlockhash.blockhash,
//     //                         instructions: initialInstructions,
//     //                     }).compileToV0Message();
//     //                     transaction.signatures = [];
//     //                     transaction.message = newMessageV0;
//     //                     transaction.sign(senderKeypairs);
//     //                 }
//     //             } else {
//     //                 console.error("Failed to send transaction:", error);
//     //                 throw error;
//     //             }
//     //         }
//     //     }
//     // }

//     // async sweepBatchTransactionV2(
//     //     recipientAddress: PublicKeyInitData,
//     //     sendersPrivateKeys: Uint8Array[]
//     // ) {
//     //     const connection: Connection = this.connection;

//     //     try {
//     //         new PublicKey(recipientAddress);
//     //     } catch (error: any) {
//     //         console.log(
//     //             "the recipientAddress is not a valid public key",
//     //             recipientAddress
//     //         );
//     //         throw new Error(error);
//     //     }

//     //     const GAS_FEE = 5005000;
//     //     // request a specific compute unit budget
//     //     const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
//     //         units: 500,
//     //     });

//     //     // set the desired priority fee
//     //     const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
//     //         microLamports: 10000000000,
//     //     });

//     //     const transaction = new Transaction()
//     //         .add(addPriorityFee)
//     //         .add(modifyComputeUnits);
//     //     const AllSenderArrayKeypair: Keypair[] = [];
//     //     for (const sender of sendersPrivateKeys) {
//     //         const senderArrayKeypair = Keypair.fromSecretKey(sender);
//     //         AllSenderArrayKeypair.push(senderArrayKeypair);
//     //         const senderBalance = await connection.getBalance(
//     //             new PublicKey(senderArrayKeypair.publicKey)
//     //         );

//     //         const amountToSend = senderBalance - GAS_FEE;
//     //         console.log("amountToSend: ", amountToSend);
//     //         transaction.add(
//     //             SystemProgram.transfer({
//     //                 fromPubkey: senderArrayKeypair.publicKey,
//     //                 toPubkey: new PublicKey(recipientAddress),
//     //                 lamports: amountToSend,
//     //             })
//     //         );
//     //     }
//     //     console.log("got heereee2");
//     //     const estimatedfees = await transaction.getEstimatedFee(connection);
//     //     console.log("estimatedfees: ", estimatedfees);
//     //     transaction.recentBlockhash = (
//     //         await connection.getLatestBlockhash()
//     //     ).blockhash;

//     //     // Sign transaction, broadcast, and confirm
//     //     const signature = await sendAndConfirmTransaction(
//     //         connection,
//     //         transaction,
//     //         AllSenderArrayKeypair,
//     //         {
//     //             maxRetries: 5,
//     //         }
//     //     );
//     //     console.log("SIGNATURE", signature);

//     //     if (this.isDevnet) {
//     //         console.log(
//     //             "View tx on explorer:",
//     //             `https://explorer.solana.com/tx/${signature}?cluster=devnet`
//     //         );
//     //     } else {
//     //         console.log("View tx on explorer:", `https://solscan.io/tx/${signature}`);
//     //     }
//     // }

//     // //INTERNAL

//     // solGetMasterAddress(): string {
//     //     return this.addressFromSeed(0);
//     // }
//     // solGetPrivateKeyFromAddressArray(AddressArray: IAddress[]) {
//     //     const privateKeys = AddressArray.map((address: IAddress) => {
//     //         const privateKey = this.solgetPrivateKeyFromSeed(address.index);
//     //         return privateKey;
//     //     });

//     //     return privateKeys;
//     // }

//     // //HELPERS
//     // solGetMultiplePublicKeyFromSeed(start: number, end: number) {
//     //     const pubkeys: string[] = [];
//     //     for (let i = start; i <= end; i++) {
//     //         const publicKey = this.solGetPublicKeyFromSeed(i);
//     //         pubkeys.push(publicKey);
//     //     }
//     //     return pubkeys;
//     // }
//     // addressFromSeedMultiple(start: number, end: number) {
//     //     const addresses: IAddress[] = [];
//     //     for (let i = start; i <= end; i++) {
//     //         const _address = this.addressFromSeed(i);
//     //         const address = {
//     //             address: _address,
//     //             index: i,
//     //         };
//     //         addresses.push(address);
//     //     }
//     //     return addresses;
//     // }
//     // addressFromSeed(index: number) {
//     //     //address is same as public key
//     //     return this.solGetPublicKeyFromSeed(index);
//     // }
//     // solGetPublicKeyFromSeed(index: number) {
//     //     const keyPair = this.deriveChildPrivateKey(index);
//     //     return keyPair.publicKey;
//     // }
//     // solgetPrivateKeyFromSeed(index: number) {
//     //     const keyPair = this.deriveChildPrivateKey(index);
//     //     return keyPair.privateKey;
//     // }
//     static GenerateNewSeed() {
//         const mnemonic = bip39.generateMnemonic(wordlist);
//         return mnemonic;
//     }
//     solGetKeyPairFromSeed() {
//         const restoredSeedBuffer = Buffer.from(this.seed, "hex").slice(0, 32);
//         const seedPhraseKeypair = Keypair.fromSeed(restoredSeedBuffer);
//         return seedPhraseKeypair;
//     }
//     deriveChildPrivateKey(index: number) {
//         const derivedKeyPair = this.deriveChildKeypair(index);
//         const privateKey = derivedKeyPair.secretKey;
//         const publicKey = derivedKeyPair.publicKey.toBase58();
//         return { privateKey, publicKey };
//     }
//     deriveChildKeypair(index: number): Keypair {
//         const path = `m/44'/501'/0'/0'/${index}'`;
//         // Derive the key for the given path
//         const derivedSeed = this.derivePath(path, Buffer.from(this.seed));
//         // Create a Solana keypair from the derived seed
//         const derivedKeyPair = Keypair.fromSeed(derivedSeed);
//         return derivedKeyPair;
//     }

//     private derivePath(path: string, seed: Uint8Array): Uint8Array {
//         const segments = path
//             .split("/")
//             .slice(1)
//             .map((seg) => {
//                 if (!seg.endsWith("'")) {
//                     throw new Error("Only hardened derivation is supported");
//                 }
//                 return parseInt(seg.slice(0, -1), 10) + 0x80000000;
//             });

//         let derived = seed;
//         for (const segment of segments) {
//             derived = this.hardenedDerivation(derived, segment);
//         }

//         return derived;
//     }

//     private hardenedDerivation(parentKey: Uint8Array, index: number): Uint8Array {
//         const indexBuffer = new Uint8Array(4);
//         new DataView(indexBuffer.buffer).setUint32(0, index, false);

//         const hmacResult = hmac(
//             sha512,
//             parentKey,
//             new Uint8Array([...parentKey, ...indexBuffer])
//         );
//         return hmacResult.slice(0, 32); // Take the first 32 bytes for the seed
//     }
//     // solConvertUint8ArrayToBase58(uint8Array: Uint8Array) {
//     //   const base58String = bs58.encode(uint8Array);
//     //   return base58String;
//     // }
// }

// export class SoonClass extends MasterSmartWalletClass { }

// // const test = async () => {
// //   const masterClass = new SoonClass();

// //   const address = masterClass.solGetMasterAddress();
// //   console.log("address: ", address);

// //   const balance = await masterClass.getNativeBalance(address);
// //   console.log("balance: ", balance);

// //   //now to send transactions
// //   const wallet1 = masterClass.addressFromSeed(1);
// //   console.log("wallet1: ", wallet1);
// //   // we will send sol from master to wallet1
// //   const res = await masterClass.SendTransaction(wallet1, 0.001);
// //   console.log("res: ", res);

// //   //now for spl tokens
// // };

// // export async function transactionSenderAndConfirmationWaiter({
// //     connection,
// //     serializedTransaction,
// //     blockhashWithExpiryBlockHeight,
// // }: TransactionSenderAndConfirmationWaiterArgs): Promise<VersionedTransactionResponse | null> {
// //     const txid = await connection.sendRawTransaction(
// //         serializedTransaction,
// //         SEND_OPTIONS
// //     );

// //     const controller = new AbortController();
// //     const abortSignal = controller.signal;

// //     const abortableResender = async () => {
// //         while (true) {
// //             await wait(2_000);
// //             if (abortSignal.aborted) return;
// //             try {
// //                 await connection.sendRawTransaction(
// //                     serializedTransaction,
// //                     SEND_OPTIONS
// //                 );
// //             } catch (e) {
// //                 console.warn(`Failed to resend transaction: ${e}`);
// //             }
// //         }
// //     };

// //     try {
// //         abortableResender();
// //         const lastValidBlockHeight =
// //             blockhashWithExpiryBlockHeight.lastValidBlockHeight - 150;

// //         // this would throw TransactionExpiredBlockheightExceededError
// //         await Promise.race([
// //             connection.confirmTransaction(
// //                 {
// //                     ...blockhashWithExpiryBlockHeight,
// //                     lastValidBlockHeight,
// //                     signature: txid,
// //                     abortSignal,
// //                 },
// //                 "confirmed"
// //             ),
// //             new Promise(async (resolve) => {
// //                 // in case ws socket died
// //                 while (!abortSignal.aborted) {
// //                     await wait(2_000);
// //                     const tx = await connection.getSignatureStatus(txid, {
// //                         searchTransactionHistory: false,
// //                     });
// //                     if (tx?.value?.confirmationStatus === "confirmed") {
// //                         resolve(tx);
// //                     }
// //                 }
// //             }),
// //         ]);
// //     } catch (e) {
// //         if (e instanceof TransactionExpiredBlockheightExceededError) {
// //             // we consume this error and getTransaction would return null
// //             return null;
// //         } else {
// //             // invalid state from web3.js
// //             throw e;
// //         }
// //     } finally {
// //         controller.abort();
// //     }

// //     // in case rpc is not synced yet, we add some retries
// //     const response = promiseRetry(
// //         async (retry: (arg0: null) => void) => {
// //             const response = await connection.getTransaction(txid, {
// //                 commitment: "confirmed",
// //                 maxSupportedTransactionVersion: 0,
// //             });
// //             if (!response) {
// //                 retry(response);
// //             }
// //             return response;
// //         },
// //         {
// //             retries: 7,
// //             minTimeout: 1e3,
// //         }
// //     );

// //     return response;
// // }

// // export const wait = (time: number) =>
// //     new Promise((resolve) => setTimeout(resolve, time));

// // const SEND_OPTIONS = {
// //     skipPreflight: true,
// //     preflightCommitment: "processed" as Commitment,
// // };

// // export class TransactionNotConfirmedError extends Error {
// //     readonly id: string = APPLICATION_ERROR.TRANSACTION_NOT_CONFIRMED_ERROR;
// //     data: { [key: string]: string } | undefined;
// //     message = "Transaction not confirmed";
// //     name = `TransactionNotConfirmedError`;
// //     statusCode = 500;
// //     isOperational = true;

// //     // base constructor only accepts string message as an argument
// //     // we extend it here to accept an object, allowing us to pass other data
// //     constructor(data: { [key: string]: string }) {
// //         super(`Transaction not confirmed: ${JSON.stringify(data)}`);
// //         this.data = data; // this property is defined in parent
// //     }
// // }

// // const APPLICATION_ERROR = {
// //     TRANSACTION_NOT_CONFIRMED_ERROR: "transaction_not_confirmed",
// // };

// export default MasterSmartWalletClass;