"use client";

import { useRouter } from "next/navigation";
import { InteractiveButton } from "@/components/ui/interactive-button";

interface ActionButtonProps {
  href: string;
  variant?: "default" | "outline";
  className?: string;
  children: React.ReactNode;
}

export default function ActionButton({
  href,
  variant = "default",
  className,
  children,
}: ActionButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <InteractiveButton
      onClick={handleClick}
      className={className}
      type="button"
    >
      {children}
    </InteractiveButton>
  );
}