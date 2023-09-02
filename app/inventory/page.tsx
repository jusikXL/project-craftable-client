"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { COLLECTION_ABI, COLLECTION_ADDRESS } from "../utils/abi/collection";
import { useAccount, useContractRead } from "wagmi";
import { tokens } from "../mint/page";
import ClientOnly from "../providers/client-only";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

export default function InventoryPage() {
  const { address, isConnected } = useAccount();

  const balance = useContractRead({
    address: COLLECTION_ADDRESS,
    abi: COLLECTION_ABI,
    functionName: "balanceOfBatch",
    args: [
      Array(tokens.length).fill(address),
      tokens.map((token) => BigInt(token.id)),
    ],
  });

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Inventory</CardTitle>
        <CardDescription>Find your minted tokens here.</CardDescription>
      </CardHeader>
      <CardContent>
        <ClientOnly>
          {isConnected ? (
            balance.data &&
            balance.data.map((tokenBalance, index) => (
              <div key={index} className="flex gap-6 items-center">
                <div>
                  <Image
                    alt={tokens[index].name}
                    height={70}
                    src={tokens[index].icon}
                    width={70}
                    className="rounded object-cover w-20 h-20"
                  />
                </div>
                <span className="text-xl font-semibold">
                  {Number(tokenBalance)}
                </span>
              </div>
            ))
          ) : (
            <Alert>
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                Connect Wallet to see your balance.
              </AlertDescription>
            </Alert>
          )}
        </ClientOnly>
      </CardContent>
    </Card>
  );
}
