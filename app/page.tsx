import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-zinc-700">
      <div className="text-center space-y-6">
        <h1
          className={cn(
            "text-6xl font-semibold drop-shadow-md text-white",
            font.className
          )}
        >
          Auth
        </h1>
        <p className="text-white text-lg mb-5">
          A simpe authentication service
        </p>
      </div>
      <div>
        <LoginButton mode="modal" asChild>
          <Button className="cursor-pointer" variant={"secondary"} size={"lg"}>
            Sign In
          </Button>
        </LoginButton>
      </div>
    </main>
  );
}
