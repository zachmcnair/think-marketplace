'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Wallet, Loader2, ExternalLink } from 'lucide-react'

interface NftGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function NftGate({ children, fallback }: NftGateProps) {
  const { ready, authenticated, user, login } = usePrivy()
  const [isHolder, setIsHolder] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(false)

  const walletAddress = user?.wallet?.address

  useEffect(() => {
    async function checkNft() {
      if (!walletAddress) {
        setIsHolder(null)
        return
      }

      setChecking(true)
      try {
        const res = await fetch(`/api/auth/nft-check?address=${walletAddress}`)
        const data = await res.json()
        setIsHolder(data.isHolder)
      } catch (error) {
        console.error('Failed to check NFT:', error)
        setIsHolder(false)
      } finally {
        setChecking(false)
      }
    }

    if (authenticated && walletAddress) {
      checkNft()
    }
  }, [authenticated, walletAddress])

  // Loading state
  if (!ready || checking) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Not authenticated
  if (!authenticated) {
    return fallback || (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to access this feature.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={login}>
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Not an NFT holder
  if (!isHolder) {
    return fallback || (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-amber-500" />
          </div>
          <CardTitle>NFT Required</CardTitle>
          <CardDescription>
            This feature is exclusive to Think NFT holders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            You need to hold a Think NFT to submit listings to the marketplace.
          </p>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <a
                href="https://opensea.io/collection/think-nft"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Collection
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // User is authenticated and is an NFT holder
  return <>{children}</>
}
