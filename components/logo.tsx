"use client"

import Link from "next/link";
import { logotext } from "../app/assets";
import Image from "next/image";

export function NamedLogoWithLink() {

  return (
    <div>
      <Link href="/" className="flex flex-row items-center gap-3">
        <Image
          src={logotext}
          alt="Intelligent Academic Assistant"
          height="225"
          width="225"
          style={{ marginTop: "10px" }}
        />{" "}
      </Link>
    </div>
  );
}
