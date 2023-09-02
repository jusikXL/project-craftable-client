"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { WORKBENCH_ABI, WORKBENCH_ADDRESS } from "../utils/abi/workbench";
import { shortenText } from "../utils/helpers/shorten.helper";
import { COLLECTION_ABI, COLLECTION_ADDRESS } from "../utils/abi/collection";
import { Label } from "@/components/ui/label";

export default function CraftPage() {
  const [progress, setProgress] = useState(13);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();

  const [blueprintIds, setBlueprintIds] = useState<bigint[]>([]);

  useEffect(() => {
    setBlueprintIds(
      JSON.parse(window.localStorage.getItem("blueprintIds") || "[]")
    );
  }, []);

  const formSchema = z.object({
    blueprintId: z.string().nonempty(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const craft = useContractWrite({
    address: WORKBENCH_ADDRESS,
    abi: WORKBENCH_ABI,
    functionName: "craft",
  });

  const readIsApproved = useContractRead({
    address: COLLECTION_ADDRESS,
    abi: COLLECTION_ABI,
    functionName: "isApprovedForAll",
    args: [address || `0x$`, WORKBENCH_ADDRESS],
  });

  const approve = useContractWrite({
    address: COLLECTION_ADDRESS,
    abi: COLLECTION_ABI,
    functionName: "setApprovalForAll",
    args: [WORKBENCH_ADDRESS, true],
  });

  const handleApprove = () => {
    toast({
      title: "Sending transaction to your wallet",
      description: "Accept it!",
    });
    approve.write();
    readIsApproved.refetch(); // does not work
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    setProgress(66);
    toast({
      title: "Sending transaction to your wallet",
      description: "Accept it!",
    });

    craft.write({
      args: [BigInt(data.blueprintId)],
    });
  }

  const { isSuccess, isError } = useWaitForTransaction({
    hash: craft.data?.hash,
  });

  const { isSuccess: isApprovalSuccess, isError: isApprovalError } =
    useWaitForTransaction({
      hash: approve.data?.hash,
    });

  useEffect(() => {
    if (isSuccess) {
      setProgress(100);
      toast({
        title: "Successfully crafted!",
      });

      setTimeout(() => setProgress(0), 1000);
    }
  }, [isSuccess, toast]);

  useEffect(() => {
    if (isApprovalSuccess) {
      toast({
        title: "Successfully approved!",
      });
    }
  }, [isApprovalSuccess, toast]);

  useEffect(() => {
    if (craft.isError || isError) {
      setProgress(0);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Double check token balance or Approve Workbench.",
      });
    }
  }, [toast, craft.isError, isError]);

  useEffect(() => {
    if (approve.isError || isApprovalError) {
      setProgress(0);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
      });
    }
  }, [toast, approve.isError, isApprovalError]);

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="blueprintId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blueprint ID</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Blueprint ID" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {blueprintIds.map((blueprintId, index) => (
                        <SelectItem value={blueprintId.toString()} key={index}>
                          <div
                            className={`flex gap-2 items-center justify-between`}
                          >
                            <span>{shortenText(blueprintId.toString())}</span>
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
                  !isConnected || !form.formState.isValid || craft.isLoading
                }
              >
                Craft
              </Button>
              <Progress value={progress} />
            </div>
          </form>
        </Form>
        <div className="grid gap-2 mt-6">
          <Label>Approve WorkBench to manage your tokens.</Label>
          <Button
            variant="secondary"
            disabled={!isConnected || approve.isLoading}
            onClick={handleApprove}
          >
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
