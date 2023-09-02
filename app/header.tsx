"use client";

import NavLink from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme";
import WalletConnect from "@/components/wallet-connect";
import ClientOnly from "./providers/client-only";

export default function Header() {
  return (
    <header className="mb-16">
      <nav>
        <ul className="mt-6 flex flex-wrap gap-x-6 whitespace-nowrap text-lg font-medium text-accents-3 items-center">
          <li className="transition-colors hover:text-foreground text-gray-500">
            <NavLink href="/mint">01 Mint</NavLink>
          </li>
          <li className="transition-colors hover:text-foreground text-gray-500">
            <NavLink href="/inventory">02 Inventory</NavLink>
          </li>
          <li className="transition-colors hover:text-foreground text-gray-500">
            <NavLink href="/blueprint">03 Create Blueprint</NavLink>
          </li>
          <li className="transition-colors hover:text-foreground text-gray-500">
            <NavLink href="/craft">04 Craft</NavLink>
          </li>
          <li>
            <ClientOnly>
              <WalletConnect />
            </ClientOnly>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
