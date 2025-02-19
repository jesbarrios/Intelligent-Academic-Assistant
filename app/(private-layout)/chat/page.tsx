import ChatInput from "./input";
import { logo } from "@/app/assets";

export default function Chat() {
  return (
    <div className="grow">
      <div className="flex flex-col items-start gap-4 pb-10 min-h-[75vh] sm:w-[95%]">
        <div className="flex flex-row items-start gap-4 ">
          <img
            src={logo.src}
            alt="Intelligent Academic Assistant"
            className="w-[60px] h-[60px] rounded-[10px]"
          />
          <div>
            <h4 className="text-xl font-medium dark:text-white">
              {"Intelligent Academic Assistant"}
            </h4>
            <p className="dark:text-slate-200 whitespace-pre-wrap">
              {
                "Hello! I am the Intelligent Academic Assistant, developed by Jesus Barrios and Cristian Reyes. This project, submitted to the Long Island Youth Summit, shows a solution to the ethical challenges created by AI, specifically the lack of human judgment and the rise of academic dishonesty. My role is to serve as an academic assistant, reinforcing student critical thinking and mitigating academic dishonesty. How may I help you?"
              }
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 bottom-0 sticky pb-8 pt-1 bg-background">
        <ChatInput />
      </div>
    </div>
  );
}
