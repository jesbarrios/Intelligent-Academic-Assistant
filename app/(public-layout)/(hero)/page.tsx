import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { logo } from "@/app/assets";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-5 justify-center h-[70vh]">
      <Image
        src={logo}
        alt="Intelligent Academic Assistant"
        className="hidden sm:block"
        height="125"
        width="125"
      />
      <h3 className="text-xl font-bold text-center">
        The Intelligent Academic Assistant is a project developed by Jesus
        Barrios and Cristian Reyes which was submitted to the Long Island Youth
        Summit.
      </h3>
      <p className="sm:w-[75%] mx-auto text-center dark:text-white text-muted-foreground ">
        The purpose for the creation of this project is as follows:
        <br />
        <br />
        - Firstly, to develop a prototype Generative AI academic assistant that
        supports critical thinking and learning while mitigating academic
        dishonesty. This prototype will serve as an alternative to the outright
        ban of Generative AI in schools.
        <br />
        - Secondly, to initiate dialogue among Long Island school districts
        regarding the ethical integration of AI, aligning with the perspectives
        of experts who advocate for AI fluency among students.
        <br />- Thirdly, to provide a tangible demonstration of a Generative AI
        resource that supports student learning and cognitive development,
        thereby encouraging schools to research and implement similar solutions.
      </p>
      <Link href="/register" className={buttonVariants({ size: "lg" })}>
        Get Started
      </Link>
    </div>
  );
}
