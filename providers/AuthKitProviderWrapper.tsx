"use client";
import { AuthKitProvider } from "@farcaster/auth-kit";
import { ReactNode } from "react";

const config = {
  rpcUrl: "https://mainnet.optimism.io",
  siweUri: "http://localhost:3000/",
  domain: "localhost:3000",
  relay: "https://relay.farcaster.xyz",
};

export default function AuthKitProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthKitProvider config={config}>{children}</AuthKitProvider>;
}
