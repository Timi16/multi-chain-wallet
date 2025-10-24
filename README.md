# Multi-VM Wallet

A TypeScript implementation of a multi-chain wallet supporting different virtual machines (EVM and SVM).

## Features

- BIP32 wallet implementation
- Support for multiple virtual machines:
  - EVM (Ethereum Virtual Machine)
  - SVM (Solana Virtual Machine)
- Transaction handling and signing
- Hierarchical Deterministic (HD) wallet support
- BIP39 mnemonic support

## Project Structure

```
├── utils/
│   ├── evm/          # Ethereum Virtual Machine implementation
│   ├── svm/          # Solana Virtual Machine implementation
│   ├── bip32Old.ts   # Legacy BIP32 implementation
│   ├── bip32Small.ts # Optimized BIP32 implementation
│   ├── walletBip32.ts# BIP32 wallet functionality
│   └── types.ts      # Type definitions
```

## Installation

```bash
npm install
```

## Usage

The wallet implements the `IChainWallet` interface for consistent cross-chain functionality. Each virtual machine implementation (EVM and SVM) follows this interface to ensure consistent behavior across different blockchains.

### Basic Usage Example

```typescript
// Import the wallet implementation
import { WalletBip32 } from './utils/walletBip32';
import { EVMWallet } from './utils/evm';
import { SVMWallet } from './utils/svm';

// Initialize wallets
const evmWallet = new EVMWallet();
const svmWallet = new SVMWallet();

// Work with different chains using the same interface
```

## Development

### Prerequisites

- Node.js (v14 or higher recommended)
- npm or yarn

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

This wallet implementation follows best practices for cryptographic security, including:
- BIP32 for hierarchical deterministic wallets
- Secure key derivation
- Support for multiple virtual machines

⚠️ Always audit and review the code before using in production environments.

## License

This project is licensed under the MIT License.
