import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS as `0x${string}`

// ERC721 balanceOf ABI
const ERC721_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

// Create a public client for Ethereum mainnet
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'),
})

/**
 * Check if a wallet address holds the required NFT
 */
export async function checkNftOwnership(walletAddress: string): Promise<boolean> {
  try {
    if (!NFT_CONTRACT_ADDRESS) {
      console.error('NFT_CONTRACT_ADDRESS not configured')
      return false
    }

    const balance = await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: ERC721_ABI,
      functionName: 'balanceOf',
      args: [walletAddress as `0x${string}`],
    })

    return balance > BigInt(0)
  } catch (error) {
    console.error('Error checking NFT ownership:', error)
    return false
  }
}

/**
 * Verify NFT ownership and return result with caching info
 */
export async function verifyNftHolder(walletAddress: string): Promise<{
  isHolder: boolean
  checkedAt: Date
}> {
  const isHolder = await checkNftOwnership(walletAddress)

  return {
    isHolder,
    checkedAt: new Date(),
  }
}
