"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { COLLECTION_ABI, COLLECTION_ADDRESS } from "../utils/abi/collection";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

export const tokens = [
  {
    id: 1,
    name: "Tank",
    icon: "/icons/tank.png",
  },
  {
    id: 1001,
    name: "Shards",
    icon: "/icons/shards.png",
  },
  {
    id: 1002,
    name: "Gears",
    icon: "/icons/gears.png",
  },
  {
    id: 1003,
    name: "Crystals",
    icon: "/icons/crystals.png",
  },
];

export default function MintPage() {
  const [progress, setProgress] = useState(13);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();

  const formSchema = z.object({
    id: z.string().nonempty(),
    amount: z.string().nonempty(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const mint = useContractWrite({
    address: COLLECTION_ADDRESS,
    abi: COLLECTION_ABI,
    functionName: "mint",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setProgress(66);
    toast({
      title: "Sending transaction to your wallet",
      description: "Accept it!",
    });
    mint.write({
      args: [address!, BigInt(data.id), BigInt(data.amount), "0x"],
    });
  }

  const { isSuccess, isError } = useWaitForTransaction({
    hash: mint.data?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setProgress(100);
      toast({
        title: "Your transaction was successful.",
      });
      setTimeout(() => setProgress(0), 1000);
    }
  }, [isSuccess, toast]);

  useEffect(() => {
    if (isError || mint.isError) {
      setProgress(0);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
      });
    }
  }, [isError, toast, mint.isError]);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Mint Token</CardTitle>
        <CardDescription>
          Mint a semifungible NFT for test in one-click.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token ID</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Token" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem value={token.id.toString()} key={token.id}>
                          <div
                            className={`flex gap-2 items-center justify-between`}
                          >
                            <span>{token.name}</span>
                            {token.icon && (
                              <Image
                                alt={token.name}
                                height={70}
                                src={token.icon}
                                width={70}
                                className="rounded object-cover w-20 h-20"
                              />
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                </FormItem>
              )}
              control={form.control}
              name="amount"
            />
            <div className="flex gap-2 items-center">
              <Button
                type="submit"
                disabled={
                  !isConnected || !form.formState.isValid || mint.isLoading
                }
              >
                Submit
              </Button>
              <Progress value={progress} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
