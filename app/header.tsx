"use client";

import NavLink from "@/components/nav-link";
import { ThemeToggle } from "@/components/theme";
import WalletConnect from "@/components/wallet-connect";
import ClientOnly from "./providers/client-only";

export default function Header() {
  return (
    <header className="mb-8 md:mb-16">
      <nav>
        <ul className="mt-6 flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 whitespace-nowrap text-lg font-medium text-accents-3 md:items-center">
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
          <li className="space-x-4">
            <ClientOnly>
              <WalletConnect />
            </ClientOnly>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
