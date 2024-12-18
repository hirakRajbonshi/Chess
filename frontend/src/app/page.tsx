"use client";
import { Button } from "@/components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main>
      <section className="h-screen w-screen flex justify-center items-center">
        <div className="h-screen w-[50%] flex justify-end items-center">
          <Image
            src="/assets/chess-board-start.png"
            width={500}
            height={500}
            alt="chess-board-start"
          ></Image>
        </div>
        <div className="h-screen w-[50%] flex flex-col justify-center items-center">
          <Button onClick={() => router.push("/game")}>Play</Button>
        </div>
      </section>
    </main>
  );
}
