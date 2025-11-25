import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("flex w-full justify-center", className)}>
      <div
        className={cn(
          "w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl",
        )}
      >
        {children}
      </div>
    </div>
  );
};
