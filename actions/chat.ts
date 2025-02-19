"use server";

import { getUser } from "@/lib/auth";
import { generateRandomId } from "@/lib/utils";
import prisma from "@/prisma/client";
import { JsonMessagesArraySchema } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import OpenAI from "openai";

export type Message = {
  message: string;
  apiKey: string;
  conversationId: string;
};

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
}

export type NewMessage = Omit<Message, "conversationId">;

export async function newChat(params: NewMessage) {
  function formatText(texts: string) {
    texts = texts.replace(/\*\*([^*]+)\*\*/g, "$1");
    texts = texts.replace(/\*([^*]+)\*/g, "$1");
    texts = texts.replace(/```([^`]+)```/g, "Code: $1");
    texts = texts.replace(/`([^`]+)`/g, "$1");

    return texts;
  }

  const session = await getUser();
  if (!session?.user) redirect("/login");
  let id: string | undefined;
  let error: undefined | { message: string };

  let message;

  message = params.message;

  if (
    params.message.toLowerCase() == "clear chat" ||
    params.message.toLowerCase() == "clearchat" ||
    params.message.toLowerCase() == "delete chat" ||
    params.message.toLowerCase() == "delete conversation" ||
    params.message.toLowerCase() == "clear conversation"
  ) {
    message = "Say this: There is no chat to clear. How may I assist you?";
  }

  try {
    const responseMessage = await createCompletion(params.apiKey, message);
    const newConversationId = generateRandomId(8);
    const newMessageJson = [
      {
        id: newConversationId,
        question: params.message,
        answer: responseMessage.message.content
          ? formatText(responseMessage.message.content)
          : responseMessage.message.content,
      },
    ];
    const dataRef = await prisma.conversation.create({
      data: {
        messages: newMessageJson,
        name: params.message,
        userId: session.user.id,
      },
    });
    id = dataRef.id;
  } catch (err) {
    if (err instanceof Error) error = { message: err.message };
  }
  console.log(error);

  if (error) return error;
  redirect(`/chat/${id}`);
}

export async function chat(params: Message) {
  const data = await prisma.conversation.findUnique({
    where: {
      id: params.conversationId,
    },
  });

  function formatText(texts: string) {
    texts = texts.replace(/\*\*([^*]+)\*\*/g, "$1");
    texts = texts.replace(/\*([^*]+)\*/g, "$1");
    texts = texts.replace(/```([^`]+)```/g, "Code: $1");
    texts = texts.replace(/`([^`]+)`/g, "$1");

    return texts;
  }

  if (
    params.message.toLowerCase() == "clear chat" ||
    params.message.toLowerCase() == "clearchat" ||
    params.message.toLowerCase() == "delete chat" ||
    params.message.toLowerCase() == "delete conversation" ||
    params.message.toLowerCase() == "clear cpnversation"
  ) {
    await prisma.conversation
      .delete({
        where: {
          id: params.conversationId,
        },
      })
      .then(() => {
        redirect("/chat");
        return;
      });
  }

  let formattedMessages: { role: string; content: string }[] = [];

  if (Array.isArray(data?.messages)) {
    for (const message of data.messages) {
      if (
        message &&
        typeof message === "object" &&
        "question" in message &&
        "answer" in message
      ) {
        formattedMessages.push({
          role: "user",
          content: message.question as string,
        });
        formattedMessages.push({
          role: "system",
          content: message.answer as string,
        });
      } else {
        console.error("Invalid message format:", message);
      }
    }
  } else {
    console.error("Data messages is not an array.");
  }

  let error: undefined | { message: string };
  try {
    const responseMessage = await createCompletion(
      params.apiKey,
      params.message,
      formattedMessages
    );
    const newConversationId = generateRandomId(8);
    const dataRef = await prisma.conversation.findUnique({
      where: {
        id: params.conversationId,
      },
    });
    const updatedMessageJson = [
      ...JsonMessagesArraySchema.parse(dataRef?.messages),
      {
        id: newConversationId,
        question: params.message,
        answer: responseMessage.message.content
          ? formatText(responseMessage.message.content)
          : responseMessage.message.content,
      },
    ];
    await prisma.conversation.update({
      where: {
        id: params.conversationId,
      },
      data: {
        messages: updatedMessageJson,
      },
    });
  } catch (err) {
    if (err instanceof Error) error = { message: err.message };
  }
  console.log(error);

  if (error) return error;
  revalidatePath(`/chat/${params.conversationId}`);
}

declare global {
  var ai_map: undefined | Map<string, OpenAI>;
}

const map = globalThis.ai_map ?? new Map<string, OpenAI>();

async function createCompletion(
  apiKey: string,
  message: string,
  messages: { role: string; content: string }[] = []
) {
  const allMessages = [
    { role: "user", content: (process.env.PROMPT || "") as string },
    ...messages,
    { role: "user", content: message },
  ];

  let ai: OpenAI;
  if (map.has(apiKey)) {
    ai = map.get(apiKey)!;
  } else {
    ai = new OpenAI({
      apiKey,
    });
    map.set(apiKey, ai);
  }

  const chatCompletion = await ai.chat.completions.create({
    model: "ft:gpt-3.5-turbo-0125:jesus-development:intelligentacademicassistant:B2RnNRsR",
    max_tokens: 1000,
    temperature: 0,
    // @ts-ignore
    messages: allMessages,
  });
  return chatCompletion.choices[0];
}
