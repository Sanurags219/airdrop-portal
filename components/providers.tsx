"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "viem/chains";
import { useState, useEffect, type ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { sdk } from "@farcaster/miniapp-sdk";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  
  const [wagmiConfig] = useState(() => 
    createConfig({
      chains: [base],
      connectors: [
        coinbaseWallet({
          appName: "BasePort",
          preference: "smartWalletOnly",
        }),
      ],
      ssr: true,
      transports: {
        [base.id]: http(),
      },
    })
  );

  useEffect(() => {
    // Initialize Farcaster SDK
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch (error) {
        console.error("Farcaster SDK initialization failed", error);
      }
    };
    init();
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
