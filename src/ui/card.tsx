import { type ComponentPropsWithRef } from "react";
import { cn } from "#src/utils/cn";

function Card({ className, ref, ...props }: ComponentPropsWithRef<"div">) {
  return <div ref={ref} className={cn("rounded-lg border bg-color-neutral-0 shadow-sm", className)} {...props} />;
}

function CardHeader({ className, ref, ...props }: ComponentPropsWithRef<"div">) {
  return <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

function CardTitle({ className, ref, ...props }: ComponentPropsWithRef<"h3">) {
  return <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />;
}

function CardDescription({ className, ref, ...props }: ComponentPropsWithRef<"p">) {
  return <p ref={ref} className={cn("text-sm text-color-neutral-800", className)} {...props} />;
}

function CardContent({ className, ref, ...props }: ComponentPropsWithRef<"div">) {
  return <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />;
}

function CardFooter({ className, ref, ...props }: ComponentPropsWithRef<"div">) {
  return <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
