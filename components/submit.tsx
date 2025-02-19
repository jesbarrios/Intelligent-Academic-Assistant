"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";

import { send } from "../app/assets";
import Image from "next/image";

export default function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="ghost" size="icon" className="h-12 w-12">
      {pending ? (
        <Loader2Icon className="w-5 h-5 animate-spin" />
      ) : (
        <div className="rounded-[10px] overflow-hidden">
          <Image src={send} alt="Send" width={50} height={50} />
        </div>
      )}
    </Button>
    
  );
}
