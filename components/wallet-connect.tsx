import { Wallet } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Chain, Connector, useAccount, useConnect, useDisconnect } from "wagmi";
import { celoAlfajores, fantom, mantleTestnet } from "wagmi/chains";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { shortenAddress } from "@/app/utils/helpers/shorten.helper";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const connectorsIcons: { [key: string]: any } = {
  "Coinbase Wallet": "/icons/coinbase.svg",
  MetaMask: "/icons/metamask.svg",
  WalletConnect: "/icons/walletconnect.svg",
};

export default function WalletConnect() {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [chainId, setChainId] = useState<Chain>(mantleTestnet);

  const account = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect({
      chainId: chainId.id,
      onSuccess: () => {
        setOpen(false);
      },
    });
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (error) {
      toast({
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error]);

  const handleDisconnect = () => {
    disconnect();
    setOpen(false);
  };

  const handleConnect = (connector: Connector) => {
    console.log(chainId);
    if (!connector.ready) {
      toast({
        description: "This connector is not ready yet.",
        variant: "destructive",
      });
      return;
    }

    connect({ connector });
  };

  if (account.isConnected && account.address) {
    return (
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <Button className="border-0" size="sm" variant="outline">
            <Wallet size={20} className="mr-2" />
            {shortenAddress(account.address, 4, 4)}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect</DialogTitle>
            <DialogDescription>
              Do you want to disconnect your wallet?
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleDisconnect} variant="default">
            Disconnect
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <Wallet size={20} className="mr-2" /> Connect
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect</DialogTitle>
          <DialogDescription>
            Please connect your wallet to continue using the app.
          </DialogDescription>
          {/* <Button onClick={() => setChainId(celoAlfajores)} variant="default">
            Use Celo Alfajores as a default chain
          </Button> */}
        </DialogHeader>
        <Select
          defaultValue="mantle"
          onValueChange={(value) => {
            switch (value) {
              case "mantle":
                setChainId(mantleTestnet);
                break;
              case "celo":
                setChainId(celoAlfajores);
                break;
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Chains</SelectLabel>
              <SelectItem value="mantle">Mantle Testnet</SelectItem>
              <SelectItem value="celo">Celo Alfajores</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex flex-col space-y-2">
          {connectors.map((connector) => {
            const iconPath = connectorsIcons[connector.name];

            return (
              <Button
                key={connector.id}
                onClick={() => handleConnect(connector)}
                variant="outline"
              >
                <span className="flex items-center space-x-2">
                  <Image
                    alt={connector.name}
                    height={24}
                    src={iconPath}
                    width={24}
                  />
                  <span>{connector.name}</span>
                </span>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
