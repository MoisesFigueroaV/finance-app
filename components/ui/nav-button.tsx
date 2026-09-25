import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  label: string;
  isActive: boolean;
};

export const NavButton = ({
  href,
  label,
  isActive,
}: Props) => {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({
          size: "sm",
          variant: "outline"
        }),
        "w-full lg:w-auto justify-between font-semibold border-none shadow-none",
        "text-white hover:text-white",
        "hover:bg-white/20 focus:bg-white/30",
        "focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none transition",
        isActive ? "bg-white/10 text-white" : "bg-transparent text-white/80"
      )}
    >
      {label}
    </Link>
  )

};
