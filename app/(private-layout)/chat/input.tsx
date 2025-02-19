"use client";

import Submit from "@/components/submit";
import { newChat } from "@/actions/chat";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function ChatInput() {
  const { toast } = useToast();

  const [textInputHeight, setTextInputHeight] = useState(50);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isLoading) return;

    if (!input) return;

    setTextInputHeight(50);
    setIsLoading(true);
    const message = input;
    setInput("");

    const apiKey = process.env.NEXT_PUBLIC_SECRETKEY!;
    const response = await newChat({ apiKey, message });

    if (response && "message" in response) {
      const { message: err } = response;
      if (err) {
        toast({
          title: err,
        });
        setIsLoading(false);
      }
    }
  }

  async function handlePaste(event: {
    preventDefault: () => void;
    clipboardData: any;
  }) {
    setTextInputHeight(100);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-row items-center gap-2 sm:pr-5"
      >
        <textarea
          autoComplete="off"
          name="message"
          style={{
            width: "95%",
            maxHeight: "100px",
            height: textInputHeight + "px",
            outline: "none",
            border: "none",
            backgroundColor: "#303030",
            color: "white",
            padding: "10px",
            resize: "none",
            borderRadius: 25,
            overflow: "auto",
          }}
          placeholder="Send a message."
          onChange={(e) => setInput(e.target.value)}
          value={input}
          onPaste={handlePaste}
          onKeyDownCapture={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!isLoading) {
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
              }
            } else if (e.key === "Enter" && e.shiftKey) {
              setTextInputHeight(100);
            }
          }}
          disabled={isLoading}
        />

        {/* Disable clicks and fade the submit button when loading */}
        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          <Submit />
        </div>
      </form>

      {isLoading && (
        <div className="text-center mt-2 text-sm dark:text-white">
          Calling the model...
        </div>
      )}

      <div className="flex justify-center pt-4">
        <span className="text-sm dark:text-white">
          The Intelligent Academic Assistant is a project developed by Jesus
          Barrios and Cristian Reyes which was submitted to the Long Island
          Youth Summit.
        </span>
      </div>
      <div className="flex justify-center pt-1">
        <span className="text-sm dark:text-[#b4b4a6]">
          Disclaimer: This is a prototype and is not intended for regular use.
          It is for demonstration purposes of the fine-tuned model only.
        </span>
      </div>
    </>
  );
}