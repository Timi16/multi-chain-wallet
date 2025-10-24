

import { ethers } from 'ethers';

// Simplified ABI for Uniswap V3 Router
const ROUTER_ABI = [
  'function exactInputSingle((address tokenIn, address tokenIn, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountOut)',
  'function exactOutputSingle((address tokenIn, address tokenIn, uint24 fee, address recipient, uint256 deadline, uint256 amountOut, uint256 amountInMaximum, uint160 sqrtPriceLimitX96)) external payable returns (uint256 amountIn)'
];

// ERC20 ABI (simplified)
const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)'
];

export interface SwapParams {
  privateKey: string;
  tokenIn: string;
  tokenOut: string;
  tokenInDecimal:number;
  amountIn: string;
  adminAddress: string;
  routerAddress: string;
  minAmountOut:string;
  rpcUrl: string;
  feeTier?: number; // 500 = 0.05%, 3000 = 0.3%, 10000 = 1%
}

export const quote = async (quoterAddress:string,rpc:string,tokenIn:string, tokenOut:string, amountIn:string, fee:number,sqrtPriceLimitX96="0") => {
  const provider = new ethers.JsonRpcProvider(rpc);

  const viewABI = [
    {
      inputs: [
        { internalType: "address", name: "tokenIn", type: "address" },
        { internalType: "address", name: "tokenOut", type: "address" },
        { internalType: "uint24", name: "fee", type: "uint24" },
        { internalType: "uint256", name: "amountIn", type: "uint256" },
        { internalType: "uint160", name: "sqrtPriceLimitX96", type: "uint160" },
      ],
      name: "quoteExactInputSingle",
      outputs: [{ internalType: "uint256", name: "amountOut", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ];

  const quoter = new ethers.Contract(quoterAddress, viewABI, provider);

  try {
    const amountOut = await quoter.quoteExactInputSingle(
      tokenIn,
      tokenOut,
      fee,
      amountIn,
      sqrtPriceLimitX96
    );

    console.log("Amount Out:", amountOut.toString());
    return amountOut.toString();
  } catch (err:any) {
    console.error("Quote failed:", err);
  }
};


export const quickSwapSetup = async (params: SwapParams) => {
  const {
    privateKey,
    tokenIn,
    tokenOut,
    amountIn,
    tokenInDecimal,
    adminAddress,
    routerAddress,
    rpcUrl,
    minAmountOut,

    feeTier = 100 // 0.01% fee tier
  } = params;

  try {
    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Create contract instances
    const router = new ethers.Contract(routerAddress, ROUTER_ABI, wallet);
    const tokenInContract = new ethers.Contract(tokenIn, ERC20_ABI, wallet);

    // Convert amount to wei
    const amountInWei = ethers.parseUnits(amountIn, tokenInDecimal); // Assuming 18 decimals

    // Check and approve token allowance
    const allowance = await tokenInContract.allowance(wallet.address, routerAddress);
    
    if (allowance < amountInWei) {
      console.log('Approving tokens...');
      const approveTx = await tokenInContract.approve(routerAddress, amountInWei);
      await approveTx.wait();
      console.log('Approval confirmed');
    }

    // Calculate amount with fee (0.01% to admin)
    const feeAmount = amountInWei * BigInt(1) / BigInt(10000); // 0.01%
    const amountAfterFee = amountInWei - feeAmount;

    // Transfer fee to admin
    if (feeAmount > 0) {
      console.log(`Transferring ${ethers.formatUnits(feeAmount, tokenIn)} fee to admin`);
      const feeTransferTx = await tokenInContract.transfer(adminAddress, feeAmount);
      await feeTransferTx.wait();
    }

    // Set deadline (10 minutes from now)
    const deadline = Math.floor(Date.now() / 1000) + 600;

    // Prepare swap parameters
    const swapParams = {
      tokenIn: tokenIn,
      tokenOut: tokenOut,
      fee: feeTier,
      recipient: wallet.address,
      deadline: deadline,
      amountIn: amountAfterFee,
      amountOutMinimum: minAmountOut,
      sqrtPriceLimitX96: 0
    };

    console.log('Executing swap...');
    
    // Execute swap
    const swapTx = await router.exactInputSingle(swapParams);
    const receipt = await swapTx.wait();

    console.log('Swap successful!');
    console.log('Transaction hash:', receipt.hash);

    // Check final balances
    const tokenOutContract = new ethers.Contract(tokenOut, ERC20_ABI, wallet);
    const finalBalance = await tokenOutContract.balanceOf(wallet.address);
    
    console.log(`Final ${tokenOut} balance:`, ethers.formatUnits(finalBalance, 18));

    return {
      success: true,
      txHash: receipt.hash,
      amountOut: finalBalance.toString()
    };

  } catch (error) {
    console.error('Swap failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};