"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { WORKBENCH_ABI, WORKBENCH_ADDRESS } from "../utils/abi/workbench";
import { shortenText } from "../utils/helpers/shorten.helper";
import { Label } from "@/components/ui/label";

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

export default function CraftPage() {
  const [progress, setProgress] = useState(13);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const [blueprintId, setBlueprintId] = useState<bigint>();

  const formSchema = z.object({
    id1: z.string().nonempty(),
    amount1: z.string().nonempty(),
    id2: z.string().nonempty(),
    amount2: z.string().nonempty(),
    id3: z.string().nonempty(),
    amount3: z.string().nonempty(),
    id4: z.string().nonempty(),
    amount4: z.string().nonempty(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const createBlueprint = useContractWrite({
    address: WORKBENCH_ADDRESS,
    abi: WORKBENCH_ABI,
    functionName: "createBlueprint",
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    setProgress(66);
    toast({
      title: "Sending transaction to your wallet",
      description: "Accept it!",
    });
    createBlueprint.write({
      args: [
        [BigInt(data.id1), BigInt(data.id2), BigInt(data.id3)],
        [BigInt(data.amount1), BigInt(data.amount2), BigInt(data.amount3)],
        [BigInt(data.id4)],
        [BigInt(data.amount4)],
      ],
    });
  }

  const {
    isSuccess,
    isError,
    data: transaction,
  } = useWaitForTransaction({
    hash: createBlueprint.data?.hash,
  });

  useEffect(() => {
    if (isSuccess) {
      setProgress(100);
      toast({
        title: "Your transaction was successful.",
      });
      const blueprintId = BigInt(transaction?.logs[0].data as string);
      setBlueprintId(blueprintId);
      window.localStorage.setItem(
        `blueprintId`,
        JSON.stringify(blueprintId.toString())
      );
      setTimeout(() => setProgress(0), 1000);
    }
  }, [isSuccess, toast, transaction]);

  useEffect(() => {
    if (isError || createBlueprint.isError) {
      setProgress(0);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
      });
    }
  }, [isError, toast, createBlueprint.isError]);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Craft</CardTitle>
        <CardDescription>
          Make sure you have enough tokens required for craft.
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
              name="blueprintId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blueprint ID</FormLabel>
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
            <div className="flex gap-2 items-center">
              <Button
                type="submit"
                disabled={
                  !isConnected || !form.formState.isValid || mint.isLoading
                }
              >
                Craft
              </Button>
              <Progress value={progress} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
