import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-[1400px]",
        className,
      )}
    >
      {children}
    </div>
  );
};
