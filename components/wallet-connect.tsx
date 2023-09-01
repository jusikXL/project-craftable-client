import { Wallet } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";
import { fantom, mantleTestnet } from "wagmi/chains";
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

const connectorsIcons: { [key: string]: any } = {
  "Coinbase Wallet": "/icons/coinbase.svg",
  MetaMask: "/icons/metamask.svg",
  WalletConnect: "/icons/walletconnect.svg",
};

export default function WalletConnect() {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const account = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect({
      chainId: mantleTestnet.id,
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
    if (!connector.ready) {
      toast({
        description: "This connector is not ready yet.",
        variant: "destructive",
      });
      return;
    }

    connect({ connector });
  };

  console.log(connectors.length);

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
        </DialogHeader>
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
