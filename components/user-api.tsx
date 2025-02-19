"use client";

import { useEffect, useState } from "react";
import SignOutButton from "@/components/signout-btn";
import { useToast } from "./ui/use-toast";

export default function UserApi() {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (window) {
      const value = localStorage.getItem("apiKey") ?? "";
      setApiKey(value);
    }
  }, []);

  function handleSave() {
    localStorage.setItem("apiKey", apiKey);
    toast({
      title: "Saved profile",
    });
  }

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <SignOutButton />
      </div>
    </>
  );
}
