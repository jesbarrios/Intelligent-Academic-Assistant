"use client";

import { chat } from "@/actions/chat";
import Submit from "@/components/submit";
import { useToast } from "@/components/ui/use-toast";
import { generateRandomId } from "@/lib/utils";
import { JSONMessage } from "@/types";
import { ElementRef, useState, useEffect, useOptimistic, useRef } from "react";
import { logo } from "../../../assets/";
import { useSession } from "next-auth/react";
import { Trash2Icon } from "lucide-react";

import { useTheme } from "next-themes";

import dotenv from "dotenv";
dotenv.config();


type ChatProps = {
  messages: JSONMessage[];
  id: string;
};

export default function Chat({ messages, id }: ChatProps) {
  const scrollRef = useRef<ElementRef<"div">>(null);

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage: string) => [
      ...state,
      {
        answer: undefined,
        id: generateRandomId(4),
        question: newMessage,
      },
    ]
  );

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [optimisticMessages]);

  const { data: session } = useSession();

  return (
    <div className="grow">
      <div className="flex flex-col items-start gap-12 pb-10 min-h-[75vh] sm:w-[95%]">
        {optimisticMessages.map((message) => (
          <div className="flex flex-col items-start gap-8 " key={message.id}>
            <div className="flex flex-row items-start gap-4 ">
              {session?.user.image ? (
                <img
                  src={session?.user.image}
                  alt="User Profile"
                  className="w-12 h-12 rounded-[10px] mr-2"
                  loading="lazy"
                />
              ) : (
                <div className="w-12 h-12 rounded-[10px] mr-2 bg-gray-200"></div>
              )}
              <div>
                <h4 className="text-xl font-medium dark:text-white">
                  {session?.user.name}
                </h4>
                <p className="dark:text-slate-200 text-slate-900 whitespace-pre-wrap">
                  {message.question}
                </p>
              </div>
            </div>

            <div className="flex flex-row items-start gap-4 ">
              <img
                src={logo.src}
                alt="Intelligent Academic Assistant"
                className="w-12 h-12 rounded-[10px] mr-2"
              />
              <div>
                <h4 className="text-xl font-medium dark:text-white">
                  {"Intelligent Academic Assistant"}
                </h4>
                <p className="dark:text-slate-200 text-slate-900 whitespace-pre-wrap">
                  {message.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div ref={scrollRef}></div>
      <div className="mt-5 bottom-0 sticky pb-8 pt-1 bg-background">
        <ChatInput id={id} addMessage={addOptimisticMessage} />
      </div>
    </div>
  );
}

type ConversationComponent = {
  id: string;
  addMessage: (msg: string) => void;
};

function ChatInput({ addMessage, id }: ConversationComponent) {
  const [textInputHeight, setTextInputHeight] = useState(50);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();
  const inputRef = useRef<ElementRef<"input">>(null);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isLoading) return;

    setTextInputHeight(50);
    const message = input;
    if (!message) return;

    setInput("");
    const apiKey = process.env.NEXT_PUBLIC_SECRETKEY!;
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    addMessage(message);

    setIsLoading(true);

    const err = await chat({
      apiKey,
      conversationId: id,
      message,
    });

    if (err?.message) {
      toast({
        title: err.message,
      });
    }
    setIsLoading(false);
  }

  async function handlePaste(event: {
    preventDefault: () => void;
    clipboardData: any;
  }) {
    setTextInputHeight(100);
  }

  const handleDelete = () => {
    setInput("Clear Chat");
  };

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
              // @ts-ignore
              if (!isLoading) handleSubmit(e);
            } else if (e.key === "Enter" && e.shiftKey) {
              setTextInputHeight(100);
            }
          }}
        />
        <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
          <Submit />
        </div>
      </form>
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
        <Trash2Icon
          className="w-20 h-15 cursor-pointer text-red-500 ml-1"
          onClick={handleDelete}
        />
      </div>
    </>
  );
}