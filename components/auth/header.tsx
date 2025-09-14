import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface headerprops {
  label: string;
}

export const Header = ({ label }: headerprops) => {
  return (
    <div className="w-full  flex flex-col justify-center items-center space-y-4">
      <h1 className={cn(" text-3xl font-semibold", font.className)}>Auth</h1>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
