'use client'

import { PrivyProvider as Privy } from '@privy-io/react-auth'

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <Privy
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#58bed7',
          logo: '/think-brainfist-darkmode-mode.svg',
        },
      }}
    >
      {children}
    </Privy>
  )
}
