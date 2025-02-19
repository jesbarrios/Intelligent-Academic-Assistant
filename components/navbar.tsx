import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { NamedLogoWithLink } from "./logo";
import Profile from "./profile";
import { SquarePen } from "lucide-react";

const btnVariant = buttonVariants({
  variant: "link",
  className: "text-base flex flex-row item-center",
  size: "sm",
});

export default function Navbar() {
  return (
    <nav className="w-full flex flex-row items-center justify-between h-24 sm:mb-7 mmb-2 top-0 sticky bg-background">
      <NamedLogoWithLink />
      <div className="flex-row items-center flex">
        <div className="sm:ml-3 flex flex-row items-center">
          <Link href="/chat" className={btnVariant}>
            <span title="New Chat">
              <SquarePen className="w-5 h-5 sm:hidden flex" />
            </span>
            <span title="New Chat">
              <SquarePen className="w-[25px] h-[25px] sm:flex hidden" />
            </span>
          </Link>
          <Profile />
        </div>
      </div>
    </nav>
  );
}
